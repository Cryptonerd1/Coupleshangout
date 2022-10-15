import { Toast } from "bootstrap";
import React, { useState } from "react";
import { FaRegThumbsUp } from "react-icons/fa";

function HangoutCard({
  id,
  owner,
  country,
  image,
  description,
  location,
  price,
  sold,
  numberOfReview,
  reviews,
  bookHangout,
  addHangoutReview,
}) {
  // console.log(reviews);
  const [writeReview, setWriteReview] = useState(false);
  const [collapseReview, setCollapseReview] = useState(false);
  const [writeReviewForm, setWriteReviewForm] = useState("");
  return (
    <div className="card hangoutCard mb-3" /*style={{ maxWidth: "740px" }}*/>
      <div className="row g-0">
        <div className="col-md-6 image-col">
          <img
            src={image}
            className="img-fluid w-100 rounded-start"
            alt="..."
          />
        </div>
        <div className="col-md-6">
          {" "}
          <div className="card-body">
            {" "}
            <h5 className="card-title">
              <b>Country: </b>
              {country}{" "}
            </h5>{" "}
            <div className="card-text">
              {" "}
              <ul className="nav flex-column">
                {" "}
                <li className="my-1">
                  <b>Description:</b> {description}{" "}
                </li>{" "}
                <li className="my-1">
                  <b>Location:</b> {location}{" "}
                </li>{" "}
                <li className="my-1">
                  {/* <b>Wif:</b> {wifi ? "Present" : "Not Present"} */}{" "}
                </li>{" "}
                <li className="my-1">
                  <b>Amount:</b> ${price / 1000000000000000000}{" "}
                </li>{" "}
                <li className="my-1">
                  <b>Sold:</b>
                  {sold}{" "}
                </li>{" "}
                <li className="my-1">
                  <b>Review:</b>
                  {numberOfReview}{" "}
                  <p>
                    <button
                      class="btn btn-primary"
                      type="button"
                      onClick={() => setCollapseReview(!collapseReview)}
                    >
                      View Reviews
                    </button>
                  </p>
                  {/* {collapseReview ? null : ( */}
                  <div class={`${collapseReview ? "" : "collapse"}`}>
                    <div class="card card-body">
                      <b>Reviews</b>
                      {reviews.map((review, index) => {
                        return (
                          <div key={index}>
                            {index + 1}. <b>Review:</b> {review.reviewerMessage}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* )} */}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            {/* <div className="card-footer"> */}
            {writeReview ? (
              <>
                <div className="row">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      value={writeReviewForm}
                      onChange={(e) => setWriteReviewForm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 d-inline-flex justify-content-around">
                    <button
                      className="btn btn-primary m-0 my-auto btn-sm"
                      onClick={() => {
                        if (writeReviewForm === "") {
                          return;
                        }
                        addHangoutReview(id, writeReviewForm);
                        setWriteReview(false);
                      }}
                    >
                      Submit
                    </button>
                    <button
                      className="btn  m-0 btn-sm"
                      onClick={() => setWriteReview(false)}
                    >
                      X
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                className="btn btn-secondary w-100"
                onClick={() => setWriteReview(true)}
              >
                Review
              </button>
            )}
            <button
              className="btn btn-primary w-100 mt-2"
              onClick={() => bookHangout(id)}
            >
              Book Hangout
            </button>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HangoutCard;
