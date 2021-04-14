(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            idMain: location.hash.slice(1),
            moreBtn: true,
            overlay: false,
        },

        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    self.images = res.data;
                })
                .catch(function (err) {
                    console.log("error in get/images: ", err);
                });

            addEventListener("hashchange", function () {
                self.idMain = location.hash.slice(1);
            });
        },

        methods: {
            clickHandler: function () {
                var self = this;
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                axios
                    .post("/uploadImage", fd)
                    .then(function (res) {
                        self.images.unshift(res.data);
                        self.title = "";
                        self.username = "";
                        self.description = "";
                    })
                    .catch(function (err) {
                        console.log("error in post upload: ", err);
                    });
            },

            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },

            getMoreImages: function () {
                var self = this;
                var imagesArr = this.images;
                var lastId = imagesArr[imagesArr.length - 1].id;
                var imagesCopy = [...this.images];
                axios
                    .get("/moreImages/" + lastId)
                    .then(function (res) {
                        for (var i = 0; i < res.data.length; i++) {
                            if (res.data[i].id == res.data[i].lowestId) {
                                self.moreBtn = false;
                            }
                        }
                        return (self.images = imagesCopy.concat(res.data));
                    })
                    .catch(function (err) {
                        console.log("error in axios get moreImages: ", err);
                    });
            },
        },
    });

    ////////////////////////////////////
    ///////    COMPONENT SNIPPET   /////
    ////////////////////////////////////

    Vue.component("component-snippet", {
        template: "#image-snippet",

        data: function () {
            return {
                createdAt: "",
                title: "",
                description: "",
                url: "",
                username: "",
            };
        },

        props: ["id"],

        mounted: function () {
            var self = this;
            axios
                .get("/image/" + this.id)
                .then(function ({ data }) {
                    self.createdAt = data.created_at;
                    self.title = data.title;
                    self.description = data.description;
                    self.url = data.url;
                    self.username = data.username;
                })
                .catch(function (err) {
                    console.log("error in get/image/Id", err);
                });
        },

        watch: {
            id: function () {
                var self = this;
                axios
                    .get("/image/" + this.id)
                    .then(function ({ data }) {
                        self.createdAt = data.created_at;
                        self.title = data.title;
                        self.description = data.description;
                        self.url = data.url;
                        self.username = data.username;
                    })
                    .catch(function (err) {
                        console.log("error in get/image/Id", err);
                    });
            },
        },

        methods: {
            closeSnippet: function () {
                this.$emit("close");
                history.pushState({}, "", "/");
            },
        },
    });

    ////////////////////////////////////
    ///////   COMPONENT COMMENTS   /////
    ////////////////////////////////////

    Vue.component("component-comments", {
        template: "#comments",

        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
                error: false,
            };
        },

        props: ["id"],

        mounted: function () {
            var self = this;
            axios
                .get("/comments/" + this.id)
                .then(function (res) {
                    self.comments = res.data;
                })
                .catch(function (err) {
                    console.log("error in axios get/comments/id : ", err);
                });
        },

        watch: {
            id: function () {
                var self = this;
                axios
                    .get("/comments/" + this.id)
                    .then(function (res) {
                        self.comments = res.data;
                    })
                    .catch(function (err) {
                        console.log("error in axios get/comments/id: ", err);
                    });
            },
        },

        methods: {
            postComment: function () {
                var self = this;
                var comment = {
                    comment: this.comment,
                    username: this.username,
                    id: this.id,
                };
                if (comment.comment != "" && comment.username != "") {
                    axios
                        .post("/postComment", comment)
                        .then(function (res) {
                            self.comments.push(res.data[0]);
                            self.comment = "";
                            self.username = "";
                            self.error = false;
                        })
                        .catch(function (err) {
                            console.log("error in post/postComment: ", err);
                        });
                } else {
                    this.error = true;
                }
            },
        },
    });
})();
