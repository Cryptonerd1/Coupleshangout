import "./App.css";
import HangoutCard from "./components/HangoutCard/HangoutCard";
import GalleryImage from "./components/GalleryImage/GalleryImage";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// web3 imports

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import HANGOUT from "./contracts/HANGOUT.abi.json";
import IERC from "./contracts/IERC.abi.json";
import HangoutForm from "./components/HangoutForm/HangoutForm";

const ERC20_DECIMALS = 18;

const contractAddress = "0x3c7a03c57BD536E905D80B93AeaAEC1A3078c6ae";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [hangouts, setHangouts] = useState([]);
  const [hangoutLoading, setHangoutLoading] = useState(true);

  const connectToWallet = async () => {
    setLoading(true);
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        setAddress(user_address);
        setKit(kit);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      setLoading(false);
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(HANGOUT, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  const getHangouts = useCallback(async () => {
    const hangoutsLength = await contract.methods.getHangoutLength().call();
    console.log(hangoutsLength);
    const hangouts = [];
    for (let index = 0; index < hangoutsLength; index++) {
      let _hangouts = new Promise(async (resolve, reject) => {
        let hangout = await contract.methods.getHangout(index).call();
        resolve({
          index: index,
          owner: hangout[0],
          country: hangout[1],
          image: hangout[2],
          description: hangout[3],
          location: hangout[4],
          price: hangout[5],
          sold: hangout[6],
          numberOfReview: hangout[7],
          reviews: hangout[8],
        });
      });
      hangouts.push(_hangouts);
    }

    const _hangouts = await Promise.all(hangouts);
    setHangouts(_hangouts);
    setHangoutLoading(false);
  }, [contract]);

  useEffect(() => {
    if (contract) {
      getHangouts();
      console.log(hangouts);
    }
  }, [contract, getHangouts]);

  const bookHangout = async (_index) => {
    const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    try {
      await cUSDContract.methods
        .approve(contractAddress, hangouts[_index].price)
        .send({ from: address });
      await contract.methods.bookHangout(_index).send({ from: address });
      getHangouts();
      getBalance();
      alert("you have successfully booked a hangout");
    } catch (error) {
      alert(error);
    }
  };

  const addHangout = async (
    _country,
    _image,
    _description,
    _location,
    _price
  ) => {
    try {
      let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
      await contract.methods
        .addHangout(_country, _image, _description, _location, price)
        .send({ from: address });
      getHangouts();
    } catch (error) {
      alert(error);
    }
  };

  const addHangoutReview = async (_index, _reviews) => {
    try {
      await contract.methods
        .addReview(_index, _reviews)
        .send({ from: address });
      getHangouts();
    } catch (error) {
      alert(error);
    }
  };

  function likeApartment(id) {
    // console.log(apartments.filter((x) => x.id === id)[0].likes + 1);
  }
  return (
    <div className="App">
      <section className="nav-section">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand fw-5 " href="./index.html">
              Couple Hangout
            </a>
            {contract !== null && cUSDBalance !== null ? (
              <div className="ms-auto text-white">
                <b>{cUSDBalance} cUSD</b>
              </div>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setLoading(true);
                  connectToWallet();
                }}
              >
                {Loading ? "Loading..." : "Connect"}
              </button>
            )}
          </div>
        </nav>
      </section>
      <section className="carousel-section">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=600"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=600"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=600"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      <h2 className="text-center mt-5">OUR GALLERY</h2>
      <section className="cards-section">
        <GalleryImage />
      </section>

      <h2 className="text-center mt-5">Hangouts</h2>
      <section className="cards-section">
        <div className="container-lg">
          <div className="row">
            {hangoutLoading ? (
              <div
                className="w-100 fs-2"
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Loading hangouts...
              </div>
            ) : (
              <>
                {hangouts.map((hangout, index) => {
                  // console.log(hangout);
                  const {
                    owner,
                    country,
                    image,
                    description,
                    location,
                    price,
                    sold,
                    numberOfReview,
                    reviews,
                  } = hangout;

                  return (
                    <div className="col-md-12">
                      <HangoutCard
                        id={index}
                        owner={owner}
                        country={country}
                        image={image}
                        description={description}
                        location={location}
                        price={price}
                        sold={sold}
                        numberOfReview={numberOfReview}
                        reviews={reviews}
                        bookHangout={bookHangout}
                        addHangoutReview={addHangoutReview}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>

      <h2 className="text-center mt-5">ADD Hangout</h2>
      <section className="my-5">
        <HangoutForm
          // apartments={apartments}
          // setApartments={setApartments}
          addHangout={addHangout}
          contract={contract}
          cUSDBalance={cUSDBalance}
          Loading={Loading}
          connectToWallet={connectToWallet}
        />
      </section>
      <section className="footer-section mt-5">
        <footer className="d-flex justify-content-around align-items-center py-3 py-4 border-top">
          <a
            href="/"
            className="mx-auto d-block text-muted text-decoration-none lh-1"
          >
            <span className="text-muted">© 2021 Company, Inc</span>
          </a>
        </footer>
      </section>
    </div>
  );
}

export default App;
