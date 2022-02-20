pragma solidity >=0.4.2;

contract Election {

    address public adminAddress;
    uint256 public totalVoterCount;
    
    struct Candidate {
        uint256 id;
        string name;
        uint256 age;
        string city;
        uint256 voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    mapping(uint256 => Candidate) public candidates;
    // Store Candidates Count
    uint256 public candidatesCount;
    event votedEvent(uint256 indexed _candidateId);

    // Constructor
    constructor() public {

        addCandidate("Rakib", 27, "gazipur");
        addCandidate("Fardin", 28, "tongi");

        setvoterinfo(12345, "shanto", "shanto@gmail.com", 24, "uttara", "123");
        setvoterinfo(12346, "shimanto", "shimanto@gmail.com", 25, "gazipur", "123");

        setadmininfo("shanto", "shanto@gmail.com", "123");
        setadmininfo("shimanto", "shimanto@gmail.com", "123");
    }


    function addCandidate(string memory _name, uint256 _age, string memory _city) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name,_age, _city, 0);
        emit setcandidate(candidatesCount, _name,_age,_city, 0);
    }

    function vote(uint256 _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

// voter

    mapping(address => bool) public votedvoterlist;

    event setcandidate(uint256 id, string name, uint256 _age, string _city, uint256 voteCount);

    uint256 public totalvoteCount = 0;

    struct voterInfo {
        uint256 nid;
        string name;
        string email;
        uint256 age;
        string city;
        string pass;
    }

    mapping(uint256 => voterInfo) public voter;

    event setvoter(
        uint256 nid,
        string name,
        string email,
        uint256 age,
        string city,
        string pass
    );

    function setvoterinfo(
        uint256 _nid,
        string memory _name,
        string memory _email,
        uint256 _age,
        string memory _city,
        string memory _pass
    ) public {
        totalVoterCount++;
        voter[totalVoterCount] = voterInfo(_nid, _name, _email, _age, _city, _pass);
        emit setvoter(_nid, _name, _email, _age, _city, _pass);
    }

//admin 
uint256 public totalAdminCount;
    struct adminInfo {
        uint256 nid;
        string name;
        string email;
        string pass;
    }

    mapping(uint256 => adminInfo) public admin;

    event setadmin(
        uint256 nid,
        string name,
        string email,
        string pass
    );

    function setadmininfo(
        string memory _name,
        string memory _email,
        string memory _pass
    ) public {
        totalAdminCount++;
        admin[totalAdminCount] = adminInfo(totalAdminCount, _name, _email, _pass);
        emit setadmin(totalAdminCount, _name, _email, _pass);
    }
}
