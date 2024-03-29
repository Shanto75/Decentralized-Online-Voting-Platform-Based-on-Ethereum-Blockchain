
App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();

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

        const list = [];
        const allemail = [];
        const allpass = [];
        var totaladmin = await App.todoList.totalAdminCount();
        for (var i = 1; i <= totaladmin; i++) {

            const admin = await App.todoList.admin(i);
            const adminemail = admin[2];
            const adminpass = admin[3];
            list[adminemail] = adminpass;

            allemail.push(adminemail);
            allpass.push(adminpass);

        }
        App.alllist = list;

        var showerror = 0;
        
        if (sessionStorage.getItem("adminlogin") == "true") {
            showerror = 1;

            for (var i = 0; i < totaladmin; i++) {

                if (sessionStorage.getItem(allemail[i]) == allpass[i]) {
                    sessionStorage.clear();
                    showerror = 0;
                    // let value = sessionStorage.getItem("lastname");

                    window.location.replace("adminweb.html");
                }
                // else
                // {
                //     showerror = 1;
                // }

            }

            if(showerror == 1){
                $("#error").html("Invalid Entry !! Please Enter Correct Email or Password.");
                showerror = 0;
                sessionStorage.clear();
            }

        }


        // console.log(App.alllist["shanto@gmail.com"]);
    },



    adminlogin: async () => {

        const email = $('#email').val();
        const pass = $('#pass').val();

        sessionStorage.setItem(email, pass);
        sessionStorage.setItem("adminlogin", "true");

        // window.location.replace("adminprofile.html");
        // let personName = sessionStorage.getItem("lastname");

        // if (App.alllist[email] == pass) {
        //     console.log(App.alllist["shanto@gmail.com"]);
        //     window.location.replace("adminprofile.html");
        // }
        // else {
        //     alert("Invalid Entry !! ");
        // }
    }

};

$(() => {
    $(window).load(() => {
        App.load();
    });
});
