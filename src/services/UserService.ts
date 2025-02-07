import { AppDataSource } from "../data-source";
import type {
  UserEntity,
  UserTypeData,
  UserVendorData,
} from "../models/types/user";
import { UserType, UserRankings, MediaType } from "../models/types/enums";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import type { MediaOutput, Location } from "../models/types/base";

export class UserService {
  private userRepository;

  constructor(request: Request) {
    this.userRepository = AppDataSource.getRepository<UserEntity>("User");
  }

  // Type guard to check if response is UserEntity
  private isUserEntity(
    response: UserEntity | HttpResponseType
  ): response is UserEntity {
    return (response as UserEntity).bio !== undefined;
  }

  async getUsers(queryParams: {
    page: number;
    limit: number;
    userType?: UserType;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }): Promise<
    | {
        users: UserEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    | HttpResponseType
  > {
    try {
      const {
        page = 1,
        limit = 10,
        userType,
        search,
        sortBy = "createdAt",
        sortOrder = "DESC",
      } = queryParams;

      const skip = (page - 1) * limit;
      const queryBuilder = this.userRepository.createQueryBuilder("user");

      if (userType) {
        queryBuilder.andWhere("user.typeData->>'type' = :userType", {
          userType,
        });
      }

      if (search) {
        queryBuilder.andWhere(
          "(user.bio->>'email' ILIKE :search OR " +
            "user.bio->'name'->>'full' ILIKE :search OR " +
            "user.bio->>'username' ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      const total = await queryBuilder.getCount();
      const users = await queryBuilder
        .orderBy(`user.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      return HttpResponse.failure("Failed to fetch users", 500);
    }
  }

  async getUserProfile(authId: string): Promise<UserEntity | HttpResponseType> {
    try {
      const user = await this.userRepository.findOne({
        where: { authId: authId },
      });

      if (!user) {
        return this.initializeUserProfile(authId);
      }

      return user;
    } catch (error) {
      return HttpResponse.failure("Failed to fetch user profile", 500);
    }
  }

  private async initializeUserProfile(
    authId: string
  ): Promise<UserEntity | HttpResponseType> {
    try {
      const newProfile = this.userRepository.create({
        authId: authId,
        bio: {
          username: "",
          email: "",
          name: {
            first: "",
            last: "",
            full: "",
          },
          photo: null,
          phone: null,
        },
        dates: {
          createdAt: Date.now(),
          deletedAt: null,
        },
        status: {
          connections: [],
          lastUpdatedAt: Date.now(),
        },
        account: this.initializeAccount(),
        typeData: {
          type: UserType.customer,
          passport: null,
          studentId: null,
          residentPermit: null,
        },
        vendorData: null,
      });

      return await this.userRepository.save(newProfile);
    } catch (error) {
      return HttpResponse.failure("Failed to initialize user profile", 500);
    }
  }

  async updateUserProfile(
    authId: string,
    data: Partial<UserEntity>
  ): Promise<UserEntity | HttpResponseType> {
    try {
      const userResult = await this.getUserProfile(authId);

      if (!this.isUserEntity(userResult)) {
        return userResult;
      }

      if (data.bio) {
        const { email, username, ...updateBio } = data.bio;
        userResult.bio = { ...userResult.bio, ...updateBio };
      }

      if (data.account?.settings) {
        userResult.account.settings = {
          ...userResult.account.settings,
          ...data.account.settings,
        };
      }

      if (data.account?.savedLocations) {
        try {
          userResult.account.savedLocations = this.validateLocations(
            data.account.savedLocations
          );
        } catch (error) {
          return HttpResponse.failure("error", 400);
        }
      }

      return await this.userRepository.save(userResult);
    } catch (error) {
      return HttpResponse.failure("Failed to update user profile", 500);
    }
  }

  async updateUserType(
    authId: string,
    data: UserTypeData
  ): Promise<UserEntity | HttpResponseType> {
    try {
      const userResult = await this.getUserProfile(authId);

      if (!this.isUserEntity(userResult)) {
        return userResult;
      }

      try {
        this.validateUserTypeData(data);
      } catch (error) {
        return HttpResponse.failure("Failed to update user type", 400);
      }

      userResult.typeData = data;

      if (data.type === UserType.vendor) {
        userResult.vendorData = this.initializeVendorData();
      } else {
        userResult.vendorData = null;
      }

      return await this.userRepository.save(userResult);
    } catch (error) {
      return HttpResponse.failure("Failed to update user type", 500);
    }
  }

  async updateVendorData(
    authId: string,
    data: Partial<UserVendorData>
  ): Promise<UserEntity | HttpResponseType> {
    try {
      const userResult = await this.getUserProfile(authId);

      if (!this.isUserEntity(userResult)) {
        return userResult;
      }

      if (
        !userResult.vendorData ||
        userResult.typeData?.type !== UserType.vendor
      ) {
        return HttpResponse.failure("User is not a vendor", 400);
      }

      userResult.vendorData = {
        ...userResult.vendorData,
        ...data,
      };

      return await this.userRepository.save(userResult);
    } catch (error) {
      return HttpResponse.failure("Failed to update vendor data", 500);
    }
  }

  async uploadMedia(
    authId: string,
    file: File,
    type: MediaType
  ): Promise<UserEntity | HttpResponseType> {
    try {
      const userResult = await this.getUserProfile(authId);

      if (!this.isUserEntity(userResult)) {
        return userResult;
      }

      const mediaOutput: MediaOutput = {
        url: "placeholder-url", // Replace with actual upload logic
        type: file.type,
        size: file.size,
      };

      // Update the appropriate field based on media type
      switch (type) {
        case "PROFILE_PHOTO":
          userResult.bio.photo = mediaOutput;
          break;
        case "LICENSE":
          if (userResult.typeData?.type !== UserType.driver) {
            return HttpResponse.failure("User is not a driver", 400);
          }
          userResult.typeData.license = mediaOutput;
          break;
        case "PASSPORT":
          if (!userResult.typeData) {
            return HttpResponse.failure("User type not set", 400);
          }
          if (
            userResult.typeData.type === UserType.customer ||
            userResult.typeData.type === UserType.vendor
          ) {
            userResult.typeData.passport = mediaOutput;
          } else {
            return HttpResponse.failure(
              "Invalid user type for passport upload",
              400
            );
          }
          break;
        case "STUDENT_ID":
          if (
            !userResult.typeData ||
            userResult.typeData.type !== UserType.customer
          ) {
            return HttpResponse.failure(
              "User must be a customer to upload student ID",
              400
            );
          }
          userResult.typeData.studentId = mediaOutput;
          break;
        case "RESIDENT_PERMIT":
          if (!userResult.typeData) {
            return HttpResponse.failure("User type not set", 400);
          }
          if (
            userResult.typeData.type === UserType.customer ||
            userResult.typeData.type === UserType.vendor
          ) {
            userResult.typeData.residentPermit = mediaOutput;
          } else {
            return HttpResponse.failure(
              "Invalid user type for resident permit upload",
              400
            );
          }
          break;
        case "VENDOR_BANNER":
          if (userResult.typeData?.type !== UserType.vendor) {
            return HttpResponse.failure("User is not a vendor", 400);
          }
          userResult.typeData.banner = mediaOutput;
          break;
        default:
          return HttpResponse.failure("Invalid media type", 400);
      }

      return await this.userRepository.save(userResult);
    } catch (error) {
      return HttpResponse.failure("Failed to upload media", 500);
    }
  }

  // Helper methods
  private initializeAccount(): UserEntity["account"] {
    return {
      rankings: {
        [UserRankings.daily]: { value: 0, lastUpdatedAt: Date.now() },
        [UserRankings.weekly]: { value: 0, lastUpdatedAt: Date.now() },
        [UserRankings.monthly]: { value: 0, lastUpdatedAt: Date.now() },
        [UserRankings.overall]: { value: 0, lastUpdatedAt: Date.now() },
      },
      meta: {},
      ratings: {
        total: 0,
        count: 0,
        average: 0,
      },
      application: null,
      trips: {},
      location: null,
      savedLocations: [],
      settings: {
        notifications: true,
        driverAvailable: false,
      },
    };
  }

  private validateUserTypeData(data: UserTypeData): void {
    switch (data.type) {
      case UserType.driver:
        if (!data.license) {
          throw new Error("Driver license is required");
        }
        break;
      case UserType.vendor:
        if (!data.location || !data.name || !data.vendorType) {
          throw new Error("Vendor details are incomplete");
        }
        this.validateLocation(data.location);
        break;
      case UserType.customer:
        break;
      default:
        throw new Error("Invalid user type");
    }
  }

  private validateLocation(location: Location): void {
    if (
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      !location.address ||
      !location.city ||
      !location.country
    ) {
      throw new Error("Invalid location data");
    }
  }

  private validateLocations(locations: Location[]): Location[] {
    return locations.map((location) => {
      this.validateLocation(location);
      return location;
    });
  }

  private initializeVendorData(): UserVendorData {
    return {
      schedule: null,
      tags: {},
      averagePrepTimeInMins: null,
    };
  }
}
