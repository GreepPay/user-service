import type { Location, MediaOutput, Phone, Ratings, Time } from './base';
import { UserRankings, UserType, UserVendorBusinessDays, UserVendorType } from './enums';

export type UserRoles = {
  isAdmin: boolean;
  isDriver: boolean;
  isVendor: boolean;
  isCustomer: boolean;
};

export type UserBio = {
  username: string;
  email: string;
  name: {
    first: string;
    last: string;
    full: string;
  };
  photo: MediaOutput | null;
  phone: Phone | null;
};

export type UserDates = {
  createdAt: number;
  deletedAt: number | null;
};

export type UserStatus = {
  connections: string[];
  lastUpdatedAt: number;
};

export type UserAccount = {
  rankings: Record<UserRankings, { value: number; lastUpdatedAt: number }>;
  meta: Record<string, number>;
  ratings: Ratings;
  application: {
    accepted: boolean;
    message: string;
  } | null;
  trips: Record<string, {
    trips: number;
    debt: number;
  }>;
  location: Location | null;
  savedLocations: Location[];
  settings: {
    notifications: boolean;
    driverAvailable: boolean;
  };
};

export type DriverTypeData = {
  type: UserType.driver;
  license: MediaOutput;
};

export type VendorTypeData = {
  type: UserType.vendor;
  vendorType: UserVendorType;
  name: string;
  banner: MediaOutput | null;
  email: string | null;
  contactNumber: Phone | null;
  description: string | null;
  website: string | null;
  location: Location;
  passport: MediaOutput | null;
  residentPermit: MediaOutput | null;
};

export type CustomerTypeData = {
  type: UserType.customer;
  passport: MediaOutput | null;
  studentId: MediaOutput | null;
  residentPermit: MediaOutput | null;
};

export type UserTypeData = DriverTypeData | VendorTypeData | CustomerTypeData;

export type UserVendorData = {
  schedule: {
    timezone: string;
    schedule: Record<UserVendorBusinessDays, { from: Time; to: Time } | null>;
  } | null;
  tags: Record<string, number>;
  averagePrepTimeInMins: { from: number; to: number } | null;
};

export type UserEntity = {
  id: string;
  authId: string;
  bio: UserBio;
  roles: UserRoles;
  dates: UserDates;
  status: UserStatus;
  account: UserAccount;
  typeData: UserTypeData | null;
  vendorData: UserVendorData | null;
};