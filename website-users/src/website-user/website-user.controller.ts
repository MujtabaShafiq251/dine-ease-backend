import { Get, Param, Controller, UseGuards } from '@nestjs/common';

import { WebsiteUserService } from './website-user.service';

// Misc
import {
  AuthGuard,
  GetUser,
  GetWebsiteUser,
  UserDetails,
  WebsiteAuthGuard,
  WebsiteUserDetails,
} from '@mujtaba-web/common';
import { WebsiteService } from 'src/website/website.service';
import { WebsiteUserDocument } from './schemas/website-user.schema';

@Controller('/api/website-user/:websiteId')
export class WebsiteUserController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly websiteUserService: WebsiteUserService,
  ) {}

  @UseGuards(WebsiteAuthGuard)
  @Get('current')
  userDetails(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
    @Param('websiteId') websiteId: string,
  ): WebsiteUserDetails {
    return this.websiteUserService.currentUser(websiteUser, websiteId);
  }

  @UseGuards(AuthGuard)
  @Get('auth')
  async auth(
    @GetUser() user: UserDetails,
    @Param('websiteId') websiteId: string,
  ): Promise<string> {
    const foundWebsite = await this.websiteService.findWebsite(websiteId);
    return this.websiteUserService.auth(user, foundWebsite);
  }

  @UseGuards(WebsiteAuthGuard)
  @Get('user-details')
  async user(
    @GetWebsiteUser() websiteUser: WebsiteUserDetails,
    @Param('websiteId') websiteId: string,
  ): Promise<WebsiteUserDocument> {
    return this.websiteUserService.findUser(websiteUser, websiteId);
  }
}