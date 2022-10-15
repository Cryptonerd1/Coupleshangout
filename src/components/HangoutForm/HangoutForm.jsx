import React, { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function HangoutForm({
  // apartments,
  // setApartments,
  addHangout,
  contract,
  cUSDBalance,
  Loading,
  connectToWallet,
}) {
  const [editProfileFormData, setEditProfileFormDate] = useState({
    country: "",
    image: "",
    description: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormDate({ ...editProfileFormData, [name]: value });
  };

  function handSubmit(e) {
    e.preventDefault();
    addHangout(
      editProfileFormData.country,
      editProfileFormData.image,
      editProfileFormData.description,
      editProfileFormData.location,
      editProfileFormData.price
    );
  }
  return (
    <section className="my-5">
      <form onSubmit={(e) => handSubmit(e)}>
        <div className="container my-5">
          <div className="row mt-4 align-items-center">
            <div className="col-md-2">
              <label htmlFor="Image" className="col-form-label">
                Image
              </label>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                id="Image"
                className="form-control"
                aria-describedby="textHelpInline"
                onChange={(e) => handleChange(e)}
                value={editProfileFormData.image}
                name="image"
              />
            </div>
          </div>
          <div className="row mt-4 align-items-center">
            <div className="col-md-2">
              <label htmlFor="Country" className="col-form-label">
                Country{" "}
              </label>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                id="Country"
                className="form-control"
                aria-describedby="textHelpInline"
                onChange={(e) => handleChange(e)}
                value={editProfileFormData.country}
                name="country"
              />
            </div>
          </div>
          <div className="row mt-4 align-items-center">
            <div className="col-md-2">
              <label htmlFor="Description" className="col-form-label">
                Description
              </label>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                id="Description"
                className="form-control"
                aria-describedby="textHelpInline"
                onChange={(e) => handleChange(e)}
                value={editProfileFormData.description}
                name="description"
              />
            </div>
          </div>
          <div className="row mt-4 align-items-center">
            <div className="col-md-2">
              <label htmlFor="Location" className="col-form-label">
                Location{" "}
              </label>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                id="Location"
                className="form-control"
                aria-describedby="textHelpInline"
                onChange={(e) => handleChange(e)}
                value={editProfileFormData.location}
                name="location"
              />
            </div>
          </div>
          <div className="row mt-4 align-items-center">
            <div className="col-md-2">
              <label htmlFor="Price" className="col-form-label">
                Price{" "}
              </label>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                id="Price"
                className="form-control"
                aria-describedby="textHelpInline"
                onChange={(e) => handleChange(e)}
                value={editProfileFormData.price}
                name="price"
              />
            </div>
          </div>
        </div>
        <div className="d-flex mt-4">
          <button type="submit" className="btn btn-primary w-75 ms-auto me-5">
            Add Location
          </button>
        </div>
      </form>
    </section>
  );
}

export default HangoutForm;
