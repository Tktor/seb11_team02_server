import { CacheModule, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAccessStrategy } from "./auth/strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./auth/strategies/jwt-refresh.strategy";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { MapModule } from "./maps/maps.module";

@Module({
  imports: [
    MapModule,
    AuthModule,
    UsersModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: true,
        context: ({ req, res }) => ({ req, res }),
        cors: {
          origin: process.env.ORIGIN,
          credentials: true,
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + "/**/*.entity.*"],
      synchronize: true,
      logging: true,
      // timezone:
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.MAP_REDIS_CONNECTION,
      isGlobal: true,
    }),
  ],
  providers: [
    JwtAccessStrategy, //
    JwtRefreshStrategy,
  ],
})
export class AppModule {}
