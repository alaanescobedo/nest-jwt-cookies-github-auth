import { SetMetadata } from "@nestjs/common";
import AUTH_CONFIG from '../config'

export const Public = () => SetMetadata(AUTH_CONFIG.METADATA.IS_PUBLIC.KEY, AUTH_CONFIG.METADATA.IS_PUBLIC.VALUE)