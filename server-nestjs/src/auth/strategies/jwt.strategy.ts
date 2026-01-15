import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()  // Why is this needed? because we are injecting dependencies into this class
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, // why is this needed? because we need to access the JWT secret from config
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "jwtSecretKey"), 
    });
  }

  async validate(payload: any) {  // why is this needed? because this method is called by passport to validate the JWT token
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user._id.toString(), email: user.email };
  }
}
