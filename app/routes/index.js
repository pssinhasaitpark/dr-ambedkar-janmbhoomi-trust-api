const userRoutes = require("../routes/user/user");
const bannerRoutes=require("../routes/pages/banner")
const biographyRoutes=require("../routes/pages/biography")
const booksRoutes=require("../routes/pages/books")
const eventRoutes=require("../routes/pages/events")
const donationRoutes=require("../routes/pages/donation")
const newRoutes=require('../routes/pages/news')


module.exports = (app) => {
    app.use("/api/user", userRoutes);
    app.use("/api/banner", bannerRoutes);
    app.use("/api/biography",biographyRoutes);
    app.use("/api/books",booksRoutes);
    app.use("/api/events",eventRoutes);
    app.use("/api/donation",donationRoutes);
    app.use("/api/news",newRoutes)  
};
