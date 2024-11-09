// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EduLingo is ReentrancyGuard, Ownable {
	struct User {
		string[] languages; // Languages the user knows
		string[] certifications; // User's certifications
		uint256 reputation; // Reputation score (0-100)
		bool exists; // Check if user exists
	}

	struct Listing {
		address creator; // Who created the listing
		bool isTeaching; // true = teaching, false = learning
		string language; // Language for the listing
		uint256 rate; // Rate per hour in tokens
		bool isActive; // If the listing is active
	}

	// State variables
	mapping(address => User) public users;
	mapping(address => Listing[]) public userListings;
	uint256 public platformFee = 5; // 5%
	IERC20 public paymentToken;

	// Events
	event UserCreated(
		address indexed user,
		string[] languages,
		string[] certifications
	);
	event ListingCreated(
		address indexed creator,
		bool isTeaching,
		string language,
		uint256 rate
	);
	event ReputationUpdated(address indexed user, uint256 newScore);

	constructor(address _paymentToken) {
		paymentToken = IERC20(_paymentToken);
	}

	// User Management
	function createUser(
		string[] memory _languages,
		string[] memory _certifications
	) external {
		require(!users[msg.sender].exists, "User already exists");
		require(_languages.length > 0, "Must specify at least one language");

		users[msg.sender] = User({
			languages: _languages,
			certifications: _certifications,
			reputation: 50, // Starting reputation
			exists: true
		});

		emit UserCreated(msg.sender, _languages, _certifications);
	}

	function updateUser(
		string[] memory _languages,
		string[] memory _certifications
	) external {
		require(users[msg.sender].exists, "User does not exist");
		require(_languages.length > 0, "Must specify at least one language");

		User storage user = users[msg.sender];
		user.languages = _languages;
		user.certifications = _certifications;

		emit UserCreated(msg.sender, _languages, _certifications);
	}

	// Listing Management
	function createListing(
		bool _isTeaching,
		string memory _language,
		uint256 _rate
	) external {
		require(users[msg.sender].exists, "Create user profile first");

		Listing memory newListing = Listing({
			creator: msg.sender,
			isTeaching: _isTeaching,
			language: _language,
			rate: _rate,
			isActive: true
		});

		userListings[msg.sender].push(newListing);

		emit ListingCreated(msg.sender, _isTeaching, _language, _rate);
	}

	// Reputation System
	function updateReputation(
		address _user,
		uint256 _score
	) external onlyOwner {
		require(users[_user].exists, "User does not exist");
		require(_score <= 100, "Score must be between 0 and 100");

		users[_user].reputation = _score;

		emit ReputationUpdated(_user, _score);
	}

	// View Functions
	function getUser(
		address _user
	)
		external
		view
		returns (
			string[] memory languages,
			string[] memory certifications,
			uint256 reputation,
			bool exists
		)
	{
		User storage user = users[_user];
		return (
			user.languages,
			user.certifications,
			user.reputation,
			user.exists
		);
	}

	function getUserListings(
		address _user
	) external view returns (Listing[] memory) {
		return userListings[_user];
	}

	function getActiveListings(
		string memory _language,
		bool _isTeaching
	)
		external
		view
		returns (address[] memory creators, uint256[] memory rates)
	{
		uint256 count = 0;
		// First count matching listings
		for (uint256 i = 0; i < userListings[msg.sender].length; i++) {
			Listing memory listing = userListings[msg.sender][i];
			if (
				listing.isActive &&
				listing.isTeaching == _isTeaching &&
				keccak256(bytes(listing.language)) ==
				keccak256(bytes(_language))
			) {
				count++;
			}
		}

		// Create return arrays
		creators = new address[](count);
		rates = new uint256[](count);

		// Fill return arrays
		uint256 index = 0;
		for (uint256 i = 0; i < userListings[msg.sender].length; i++) {
			Listing memory listing = userListings[msg.sender][i];
			if (
				listing.isActive &&
				listing.isTeaching == _isTeaching &&
				keccak256(bytes(listing.language)) ==
				keccak256(bytes(_language))
			) {
				creators[index] = listing.creator;
				rates[index] = listing.rate;
				index++;
			}
		}

		return (creators, rates);
	}

	// Admin Functions
	function updatePlatformFee(uint256 _newFee) external onlyOwner {
		require(_newFee <= 10, "Fee too high"); // Max 10%
		platformFee = _newFee;
	}

	function updatePaymentToken(address _newToken) external onlyOwner {
		paymentToken = IERC20(_newToken);
	}
}
