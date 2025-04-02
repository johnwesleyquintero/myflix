/* global use, db */
// MongoDB Playground Configuration
// ================================

// Database Configuration
// ----------------------
const DB_NAME = 'mongodbVSCodePlaygroundDB';
use(DB_NAME);

// Sample Data Setup
// -----------------

const SALES_COLLECTION = 'sales';

// Insert sample sales data
db.getCollection(SALES_COLLECTION).insertMany([
  { 'item': 'abc', 'price': 10, 'quantity': 2, 'date': new Date('2014-03-01T08:00:00Z') },
  { 'item': 'jkl', 'price': 20, 'quantity': 1, 'date': new Date('2014-03-01T09:00:00Z') },
  { 'item': 'xyz', 'price': 5, 'quantity': 10, 'date': new Date('2014-03-15T09:00:00Z') },
  { 'item': 'xyz', 'price': 5, 'quantity': 20, 'date': new Date('2014-04-04T11:21:39.736Z') },
  { 'item': 'abc', 'price': 10, 'quantity': 10, 'date': new Date('2014-04-04T21:23:13.331Z') },
  { 'item': 'def', 'price': 7.5, 'quantity': 5, 'date': new Date('2015-06-04T05:08:13Z') },
  { 'item': 'def', 'price': 7.5, 'quantity': 10, 'date': new Date('2015-09-10T08:43:00Z') },
  { 'item': 'abc', 'price': 10, 'quantity': 5, 'date': new Date('2016-02-06T20:20:13Z') },
]);

// Query Operations
// ----------------

// Count sales on April 4th, 2014
const april4SalesCount = db.getCollection(SALES_COLLECTION).find({
  date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
}).count();

console.log(`Sales on April 4th, 2014: ${april4SalesCount}`);

// Aggregation Pipeline
// --------------------
// Calculate total sales by product for 2014
const salesByProduct2014 = db.getCollection(SALES_COLLECTION).aggregate([
  // Find all of the sales that occurred in 2014.
  { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
  // Group the total sales for each product.
  { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
]);
