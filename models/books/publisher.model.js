import { response } from "express";
import mysql from "mysql2/promise";

const sqlConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "librery_app",
};

const pool = mysql.createPool(sqlConfig);

export class PublisherModel {
  // GET PUBLISHERS, NO NECESITA INFORMACION
  static async getPublisher() {
    try {
      const publishers = await pool.query(
        "SELECT id, publisher_name FROM libr_publisher"
      );

      return {
        header: "Successfull searching the publishers",
        message: "Successful search",
        response: publishers[0],
        statusCode: 200,
        success: true,
        severity: "success",
      };
    } catch (err) {
      console.log(err);
      return {
        header: "Internal server error",
        message: "Please, contact technical service.",
        success: false,
        statusCode: 500,
        severity: "error",
      };
    }
  }

  //? UPDATE, NECESITARA EL ID
  static async updatePublisher() {}
  //* CREATE, NO NESESITARA NADA
  static async createPublisher() {}
  //! DETELE, NECESITARA EL ID
  static async deletePublisher() {}
}
