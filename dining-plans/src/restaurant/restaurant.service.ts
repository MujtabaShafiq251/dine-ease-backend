import { Injectable, NotFoundException } from '@nestjs/common';

// Database
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
  RestaurantModel,
} from './models/restaurant.entity';

// NATS
import {
  EventData,
  RestaurantApprovedEvent,
  RestaurantDeletedEvent,
  RestaurantUpdatedEvent,
  RestaurantDetailsUpdatedEvent,
} from '@dine_ease/common';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: RestaurantModel,
  ) {}

  // find restaurant by ids
  async validateRestaurantIds(ids: Types.ObjectId[]): Promise<boolean> {
    const found = await this.restaurantModel.find({
      _id: { $in: ids },
    });
    if (found.length === ids.length) return true;
    throw new NotFoundException('Restaurant Not Found');
  }

  // find restaurant by version
  async findRestaurantByVersion(event: EventData): Promise<RestaurantDocument> {
    const found = await this.restaurantModel.findByEvent(event);
    if (!found) throw new NotFoundException('Restaurant not found');
    return found;
  }

  // create restaurant
  async createRestaurant(data: RestaurantApprovedEvent): Promise<void> {
    const { id, ...details } = data;
    const newData = { _id: id, ...details };
    await this.restaurantModel.create(newData);
  }

  // update restaurant
  async updateRestaurant(data: RestaurantUpdatedEvent): Promise<void> {
    const { id, version, ...details } = data;
    const event: EventData = { id, version };
    const found: RestaurantDocument = await this.findRestaurantByVersion(event);
    found.set(details);
    await found.save();
  }

  // update restaurant
  async updateRestaurantDetails(
    data: RestaurantDetailsUpdatedEvent,
  ): Promise<void> {
    const { id, version, ...details } = data;
    const event: EventData = { id, version: version };
    const found: RestaurantDocument = await this.findRestaurantByVersion(event);
    found.set(details);
    await found.save();
  }

  // delete restaurant
  async deleteRestaurant(data: RestaurantDeletedEvent): Promise<void> {
    const found: RestaurantDocument = await this.findRestaurantByVersion(data);
    found.set({ isDeleted: true });
    await found.save();
  }
}