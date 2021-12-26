/*
* Specify the maximum number of items to retrieve and a starting offset into the collection.
*/
export type Pagination = {
  // limit the amount of data returned by any single request
  limit?: number;
  offset?: number;
};
