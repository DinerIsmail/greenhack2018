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
            var sumofratings=0;
            var sumofspans=0;
            for(var nb in obj[key]['reviews']) {
                sumofratings+=obj[key]['reviews'][nb]['rating'];
                sumofspans+=obj[key]['reviews'][nb]['lifespan'];
            };
            var averagerating=sumofratings/obj[key]['reviews'].length;
            var averagelifespan=sumofspans/obj[key]['reviews'].length;
            var arr=[];
            arr.push(obj[key]['brand'] || '');
            arr.push(obj[key]['model'] || '');
            arr.push(key || '');
            arr.push(String(averagerating) || '');
            arr.push(String(averagelifespan) || '');
            dataSet.push(arr);
        };
        
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
    console.log(dataSet);
    //for(var key in dataSet) {console.log(key)};
    //var dataSet=[['test1','test2','test3','test4','test5'],['test1','test2','test3','test4','test5']]
    //console.log(dataSet);
    
});