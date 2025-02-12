import type { BunRequest } from "../routes/router";
import { VerificationService } from "../services/VerificationService";

export class VerificationController {
  async create(request: BunRequest) {
    return new VerificationService().createVerification(request);
  }

  async approveVerification(request: BunRequest) {
    return new VerificationService().approveVerification(request);
  }
}
