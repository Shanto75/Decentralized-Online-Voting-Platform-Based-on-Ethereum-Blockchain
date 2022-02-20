
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
        await App.renderTasks();
    },

    renderTasks: async () => {
        // Load the total task count from the blockchain
        var totalvoter = await App.todoList.totalVoterCount();

        $("#voter").html("Number of Voters : " + totalvoter);

        var totalcandidate = await App.todoList.candidatesCount();

        $("#candidate").html("Number of Candidates : " + totalcandidate);

        // // Render out each task with a new task template
        for (var i = 1; i <= totalvoter; i++) {
            // Fetch the task data from the blockchain
            const voter = await App.todoList.voter(i);
            const nid = voter[0].toNumber();
            const name = voter[1];
            const email = voter[2];
            const age = voter[3].toNumber();
            const city = voter[4];

            // $("#voterlist").html("NID : " + nid + " Name : " + name +" Age : " + age +" City : " + city + " Vote status : "+ voted);

            var list = $("#voterlist");
            var eachvoter =
                "<tr><td>" +
                i +
                "</td><td>" +
                nid +
                "</td><td>" +
                name +
                "</td><td>" +
                email +
                "</td><td>" +
                age +
                "</td><td>" +
                city +
                "</td></tr>";
            list.append(eachvoter);
        }

        for (var i = 1; i <= totalcandidate; i++) {
            // Fetch the task data from the blockchain
            const candidate = await App.todoList.candidates(i);
            const nid = candidate[0].toNumber();
            const name = candidate[1];
            const age = candidate[2].toNumber();
            const city = candidate[3];
            const votecount = candidate[4].toNumber();

            // $("#voterlist").html("NID : " + nid + " Name : " + name +" Age : " + age +" City : " + city + " Vote status : "+ voted);

            var list = $("#candidatelist");
            var eachcandidate =
                "<tr><td>" +
                i +
                "</td><td>" +
                nid +
                "</td><td>" +
                name +
                "</td><td>" +
                age +
                "</td><td>" +
                city +
                "</td><td>" +
                votecount +
                "</td></tr>";
            list.append(eachcandidate);
        }

    }

};

$(() => {
    $(window).load(() => {
        App.load();
    });
});
