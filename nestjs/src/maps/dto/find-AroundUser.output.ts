import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

@ObjectType()
export class UserWithLocation extends User {
  @Field(() => String)
  lat: string;

  @Field(() => String)
  lng: string;
}
