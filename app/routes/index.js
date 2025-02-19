const userRoutes = require("../routes/user/user");
const bannerRoutes=require("../routes/pages/banner")
const biographyRoutes=require("../routes/pages/biography")
const booksRoutes=require("../routes/pages/books")
const eventRoutes=require("../routes/pages/events")
const donationRoutes=require("../routes/pages/donation")
const newsRoutes=require('../routes/pages/news')
const contactRoutes=require("../routes/pages/contact")
const galleryRoutes=require('../routes/pages/gallery')
module.exports = (app) => {
    app.use("/api/user", userRoutes);
    app.use("/api/banner", bannerRoutes);
    app.use("/api/biography",biographyRoutes);
    app.use("/api/books",booksRoutes);
    app.use("/api/events",eventRoutes);
    app.use("/api/donation",donationRoutes);
    app.use("/api/news",newsRoutes);
    app.use("/api/contact",contactRoutes);
    app.use("/api/gallery",galleryRoutes)  
};
