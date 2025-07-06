import { Controller, Get } from "@nestjs/common";
import { SkipAuth } from "./common/decorators/public.decorator";

@Controller('teste')
export class AppController {
    @Get('/ping')
    @SkipAuth()
    ping() {
        return 'pong';
    }
}