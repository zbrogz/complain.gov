var app = new Vue({
    el: '#app',
    data: {
        form: {
            text: '',
        },
        complaints: []
    },
    created: function() {
        this.getComplaints();
    },
    computed: {

    },
    methods: {
        getComplaints: function() {
            axios.get("/api/complaints").then(response => {
                this.complaints = response.data;
              return true;
            }).catch(err => {
            });
        },
        addComplaint: function() {
            axios.post("/api/complaints", {
                text: this.form.text,
            }).then(response => {
                this.form.text = "";
                this.getComplaints();
                return true;
            }).catch(err => {
            });
        },
        deleteComplaint: function(id) {
            axios.delete("/api/complaints/" + id).then(response => {
                this.getComplaints();
                return true;
            }).catch(err => {
            });
        },
        updateComplaint: function(complaint) {
            axios.put("/api/complaints/" + complaint.id, complaint).then(response => {
                this.getComplaints();
                return true;
            }).catch(err => {
            });
        },
        upVote: function(complaint) {
            complaint.votes += 1;
            this.updateComplaint(complaint)
        },
        downVote: function(complaint) {
            complaint.votes -= 1;
            this.updateComplaint(complaint)
        },
        clear: function() {
            this.form.text = '';
        },
        generate: function() {
            axios.get("https://www.reddit.com/r/complaints/random.json").then(response => {
                this.form.text = response.data[0].data.children[0].data.selftext;
                return true;
              }).catch(err => {
              });

        },
    }
});