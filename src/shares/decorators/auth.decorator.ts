import { applyDecorators, UseGuards } from "@nestjs/common"
import { UserRole } from "../enums/role.enum"
import { AuthGuard } from "src/guards/auth.guard"
import { Role } from "./role.decorator"
import { ApiBearerAuth } from "@nestjs/swagger"
import { RoleGuard } from "src/guards/role.guard"

// export const Auth = (...roles: UserRole[]) => applyDecorators(UseGuards(AuthGuard, RoleGuard), Role(...roles), ApiBearerAuth())

export const Auth = (...roles: UserRole[]) => {
    return applyDecorators(
        UseGuards(AuthGuard, RoleGuard),
        Role(...roles),
        ApiBearerAuth()
    );
}