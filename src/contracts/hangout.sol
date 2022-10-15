// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Coupleshangout {
    uint256 private hangoutLength = 0;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // declaring the struct for the review
    struct Review {
        uint256 postId;
        address reviewerAddress;
        string reviewerMessage;
    }

    struct Hangout {
        address payable owner;
        string country;
        string image;
        string description;
        string location;
        uint256 price;
        uint256 sold;
    }

    mapping(uint256 => Hangout) private hangouts;

    mapping(uint => mapping(address => bool)) private reviewed;
    
    mapping(uint256 => Review[]) private reviewsMap; // mapping reviews

    // checks if resort exists by checking if the owner address has been initialized
    modifier exists(uint256 _index) {
        require(
            hangouts[_index].owner != address(0),
            "Query of nonexistent resort"
        );
        _;
    }

    /**
        * @dev allow users to add a resort  to the platform
        * @notice Input data needs to contain only valid/non-empty values
     */
    function addHangout(
        string calldata _country,
        string calldata _image,
        string calldata _description,
        string calldata _location,
        uint256 _price
    ) public {
        require(bytes(_country).length >= 4, "Invalid country");
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_description).length > 0, "Empty description");
        require(bytes(_location).length > 0, "Empty location");
        uint256 _sold = 0;

        hangouts[hangoutLength] = Hangout(
            payable(msg.sender),
            _country,
            _image,
            _description,
            _location,
            _price,
            _sold
        );
        hangoutLength++;
    }

    function getHangout(uint256 _index)
        public
        view
        exists(_index)
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            Review[] memory
        )
    {
        Hangout memory h = hangouts[_index];
        Review[] memory reviews = reviewsMap[_index];
        return (
            h.owner,
            h.country,
            h.image,
            h.description,
            h.location,
            h.price,
            h.sold,
            reviews.length,
            reviews
        );
    }

    /// @dev adds a review to a vacation couple's hangout/resort
    function addReview(uint256 _index, string calldata _reviews)
        public
        exists(_index)
    {
        require(!reviewed[_index][msg.sender], "You have already reviwed this resort");
        reviewed[_index][msg.sender] = true;
        reviewsMap[_index].push(Review(_index, address(msg.sender), _reviews));
    }

    /**
        * @dev allow users to book a resort/hangout
     */
    function bookHangout(uint256 _index) public payable exists(_index) {
        Hangout storage currentHangout = hangouts[_index];
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentHangout.owner,
                currentHangout.price
            ),
            "Can not perform transactions."
        );
    }

    function getHangoutLength() public view returns (uint256) {
        return hangoutLength;
    }

}
