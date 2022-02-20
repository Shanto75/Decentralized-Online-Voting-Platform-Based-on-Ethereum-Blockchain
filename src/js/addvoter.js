// App = {
//     web3Provider: null,
//     contracts: {},
//     account: "0x0",

//     init: function () {
//       return App.initWeb3();
//     },

//     initWeb3: function () {
//       if (typeof web3 !== "undefined") {
//         // If a web3 instance is already provided by Meta Mask.
//         App.web3Provider = web3.currentProvider;
//         web3 = new Web3(web3.currentProvider);
//       } else {
//         // Specify default instance if no web3 instance provided
//         App.web3Provider = new Web3.providers.HttpProvider(
//           "http://localhost:7545"
//         );
//         web3 = new Web3(App.web3Provider);
//       }
//       return App.initContract();
//     },

//     listenForEvents: function () {
//       App.contracts.Election.deployed().then(function (instance) {
//         instance
//           .votedEvent(
//             {},
//             {
//               // fromBlock: 0,
//               fromBlock: "latest",
//               toBlock: "latest",
//             }
//           )
//           .watch(function (error, event) {
//             console.log("event triggered", event);
//             // Reload when a new vote is recorded
//             App.render();
//           });
//       });
//     },

//     initContract: function () {
//       $.getJSON("Election.json", function (election) {
//         // Instantiate a new truffle contract from the artifact
//         App.contracts.Election = TruffleContract(election);
//         // Connect provider to interact with contract
//         App.contracts.Election.setProvider(App.web3Provider);
//         return App.render();
//       });
//     },

//     loadContract: async () => {
//       // Create a JavaScript version of the smart contract
//       const todoList = await $.getJSON('Election.json')
//       App.contracts.TodoList = TruffleContract(todoList)
//       App.contracts.TodoList.setProvider(App.web3Provider)

//       // Hydrate the smart contract with values from the blockchain
//       App.todoList = await App.contracts.TodoList.deployed()
//     },

//     render: function () {
//       var electionInstance;

//       if (web3.currentProvider.enable) {
//         //For metamask
//         web3.currentProvider.enable().then(function (acc) {
//           App.account = acc[0];
//           $("#accountAddress").html("Your Account: " + App.account);
//         });
//       } else {
//         App.account = web3.eth.accounts[0];
//         $("#accountAddress").html("Your Account: " + App.account);
//       }

//       App.contracts.Election.deployed()
//         .then(function (instance) {
//           electionInstance = instance;
//           return electionInstance.get();
//         })
//         .then(function (get) {
//           // Store all promised to get candidate info
//           var p = get;
//           $("#num").html("number: " + p);
//           console.log(p);
//         });

//     },

//     // createTask: function () {
//     //   var number = $("#setnumber").val();
//     //   App.contracts.Election.deployed()
//     //     .then(function (instance) {
//     //       return instance.set(number);
//     //     })
//     //     .catch(function (err) {
//     //       console.error(err);
//     //     });
//     // },

//     // createTask: function () {
//     //   var candidateId = $("#setnumber").val();
//     //   App.contracts.Election.deployed()
//     //     .then(function (instance) {
//     //       return instance.set(candidateId);
//     //     })
//     //     .then(function (result) {
//     //       // window.location.reload()
//     //       // Wait for votes to update
//     //     })
//     //     .catch(function (err) {
//     //       console.error(err);
//     //       // window.location.reload()
//     //     });
//     // },

//     createTask: async () => {
//       const content = $('#setnumber').val()
//       await App.todoList.set(content)
//       window.location.reload()
//     },

//   };

//   $(function () {
//     $(window).load(function () {
//       App.init();
//     });
//   });

App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON("Election.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed();
  },

  render: async () => {
    // Render Account
    $("#accountAddress").html("Your Account Address : " + App.account);

    // Render Tasks
    // await App.renderTasks();
  },

  // renderTasks: async () => {
  //   // Load the total task count from the blockchain
  //   var totalvoter = await App.todoList.totalVoterCount();

  //   $("#voter").html("Number of Voters : " + totalvoter);

  //   var totalcandidate = await App.todoList.totalCandidateCount();

  //   $("#candidate").html("Number of Candidates : " + totalcandidate);

  //   // // Render out each task with a new task template
  //   for (var i = 1; i <= totalvoter; i++) {
  //     // Fetch the task data from the blockchain
  //     const voter = await App.todoList.voter(i);
  //     const nid = voter[0].toNumber();
  //     const name = voter[1];
  //     const age = voter[2].toNumber();
  //     const city = voter[3];
  //     const voted = voter[4];

  //     // $("#voterlist").html("NID : " + nid + " Name : " + name +" Age : " + age +" City : " + city + " Vote status : "+ voted);

  //     var list = $("#voterlist");
  //     var eachvoter =
  //       "<tr><td>" +
  //       i +
  //       "</td><td>" +
  //       nid +
  //       "</td><td>" +
  //       name +
  //       "</td><td>" +
  //       age +
  //       "</td><td>" +
  //       city +
  //       "</td><td>" +
  //       voted +
  //       "</td></tr>";
  //     list.append(eachvoter);
  //   }

  //   for (var i = 1; i <= totalcandidate; i++) {
  //     // Fetch the task data from the blockchain
  //     const candidate = await App.todoList.candidate(i);
  //     const nid = candidate[0].toNumber();
  //     const name = candidate[1];
  //     const city = candidate[2];
  //     const votecount = candidate[3].toNumber();

  //     // $("#voterlist").html("NID : " + nid + " Name : " + name +" Age : " + age +" City : " + city + " Vote status : "+ voted);

  //     var list = $("#candidatelist");
  //     var eachcandidate =
  //       "<tr><td>" +
  //       i +
  //       "</td><td>" +
  //       nid +
  //       "</td><td>" +
  //       name +
  //       "</td><td>" +
  //       city +
  //       "</td><td>" +
  //       votecount +
  //       "</td></tr>";
  //     list.append(eachcandidate);
  //   }

  //    // Load the total task count from the blockchain
  //   const taskCount = await App.todoList.taskCount()

  //   // Render out each task with a new task template
  //   for (var i = 1; i <= taskCount; i++) {
  //     // Fetch the task data from the blockchain
  //     const task = await App.todoList.tasks(i)
  //     const taskId = task[0].toNumber()
  //     const taskContent = task[1]
  //     const taskCompleted = task[2]

  //     // Create the html for the task
  //     var tasklist = $("#task");
  //     var eachtask =
  //     "<tr><td>" +
  //     taskId +
  //     "</td><td>" +
  //     taskContent +
  //     "</td><td>" +
  //     taskCompleted +
  //     "</td></tr>";

  //     tasklist.append(eachtask);
  //   }
  // },

  // createTask: async () => {
  //   const content = $('#newTask').val();
  //   await App.todoList.createTask(content, {from: App.account });
  //   window.location.reload();
  // },

  setvoter: async () => {
    const nid = $('#nid').val();
    const name = $('#name').val();
    const email = $('#email').val();
    const age = $('#age').val();
    const city = $('#city').val();
    const pass = $('#pass').val();

    await App.todoList.setvoterinfo(nid, name, email, age, city, pass, {from: App.account });
    window.location.reload();
  }

  // setcandidate: async () => {
  //   const nid = $('#candinid').val();
  //   const name = $('#candiname').val();
  //   const city = $('#candicity').val();

  //   await App.todoList.setcandidateinfo(nid, name, city, {from: App.account });
  //   window.location.reload();
  // }

  // setcandidate: async () => {
  //   // const nid = $('#candinid').val();
  //   const name = $('#candiname').val();
  //   // const city = $('#candicity').val();

  //   await App.todoList.addCandidate(name, {from: App.account });
  //   window.location.reload();
  // }

};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
