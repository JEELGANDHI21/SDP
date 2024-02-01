import React, { useState } from "react";

export default function AddProduct() {
  const [pname, setPname] = useState("");
  const [pprice, setPprice] = useState("");
  const [pdesc, setPdesc] = useState("");
  const [pcat, setPcat] = useState("");

  
  return (
    <div>
      <h1>ADD PRODUCT HERE : </h1>
      <label>Enter Product Name : </label>
      <input type="text" value={pname} onChange={(e)=>{setPname(e.target.value)}}/>
      <br />
      <br />
      <label>Enter Product Price : </label>
      <input type="text" value={pprice} onChange={(e)=>{setPprice(e.target.value)}}/>
      <br />
      <br />
      <label>Enter Product Description : </label>
      <input type="text" value={pdesc} onChange={(e)=>{setPdesc(e.target.value)}}/>
      <br />
      <br />
      <label>Enter Product Category : </label>
      <input type="text" value={pcat} onChange={(e)=>{setPcat(e.target.value)}}/>
      <br />
      <br />
      <label>Enter Product Image : </label>
      <input type="file"></input>
      <br />
      <br />

      <button>Submit</button>
    </div>
  );
}
