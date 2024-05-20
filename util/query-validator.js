export const filterBooksDinamic = (queryParams) => {
  // Verifica que queryParams sea un array
  if (!Array.isArray(queryParams)) {
    throw new TypeError("Expected an array for queryParams");
  }

  let query = "SELECT * FROM libr_books WHERE 1 = 1";
  const params = [];

  queryParams.forEach((p) => {
    if (p.value === undefined) {
      return;
    } else {
      if (p.dataType === "str" && typeof p.value === "string") {
        query += ` AND ${p.name} LIKE ?`;
        params.push(`%${p.value}%`);
      } else if (p.dataType === "numb" && typeof p.value === "number") {
        query += ` AND ${p.name} = ?`;
        params.push(p.value);
      } else if (p.dataType === "arrayNumbers" && Array.isArray(p.value)) {
        if (p.value.length === 2) {
          // Espera que el array tenga dos valores
          query += ` AND ${p.name} BETWEEN ? AND ?`;
          p.value.forEach((v) => {
            params.push(v);
          });
        } else {
          throw new TypeError(
            "Expected array of length 2 for 'arrayNumbers' dataType"
          );
        }
      } else if (p.dataType === "jsonArray") {
        query += ` AND JSON_CONTAINS(GENEROS, ?, '$');`;
        params.push(p.value);
      }
    }
  });

  return { query, params };
};
