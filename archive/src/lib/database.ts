import { connect } from "@planetscale/database";

export function getConnection() {
  return connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });
}
