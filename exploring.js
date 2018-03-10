$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyBsAQ3RHmTCPNI4k94dl3o1Qoyv_MYTiQg",
        authDomain: "lifespanner-b62e1.firebaseapp.com",
        databaseURL: "https://lifespanner-b62e1.firebaseio.com",
        storageBucket: "<BUCKET>.appspot.com",
        messagingSenderId: "<SENDER_ID>",
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var reviewRef = database.ref('/');
    var dataSet = [];
    reviewRef.on('value', function(snapshot) {
        var obj=snapshot.val();
        for(var key in obj) {
            console.log(obj[key]['reviews']);
            var sumofratings=0;
            var sumofspans=0;
            for(var nb in obj[key]['reviews']) {
                sumofratings+=obj[key]['reviews'][nb]['rating'];
                sumofspans+=obj[key]['reviews'][nb]['lifespan'];
            };
        var averagerating=sumofratings/obj[key]['reviews'].length;
        var averagelifespan=sumofspans/obj[key]['reviews'].length;
        dataSet.push([obj[key]['brand'],obj[key]['model'],key,averagerating,averagelifespan])
        };
    });
    console.log(dataSet);
    $('#table').DataTable( {
        data: dataSet,
        columns: [
            { title: "Brand" },
            { title: "Model" },
            { title: "ASIN" },
            { title: "Average rating" },
            { title: "Average lifespan" }
        ]
    } );
});