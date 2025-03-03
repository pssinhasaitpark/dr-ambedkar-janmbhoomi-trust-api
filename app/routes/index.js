const userRoutes = require("../routes/user/user");
const bannerRoutes=require("../routes/pages/banner")
const biographyRoutes=require("../routes/pages/about")
const booksRoutes=require("../routes/pages/books")
const eventRoutes=require("../routes/pages/events")
const donationRoutes=require("../routes/pages/donation")
const newsRoutes=require('../routes/pages/news')
const contactRoutes=require("../routes/pages/contact")
const galleryRoutes=require('../routes/pages/gallery');
const newsletterRoutes=require('../routes/user/newsletter')
const book_listingRoutes=require('../routes/book_listing')
const donation_collectionRoutes=require('../routes/pages/donation_collection')
const event_lisintingRoutes=require('../routes/pages/event_listing')
const social_mediaRoutes=require('../routes/user/social_media')
module.exports = (app) => {
    app.use("/api/user", userRoutes);
    app.use("/api/banner", bannerRoutes);
    app.use("/api/biography",biographyRoutes);
    app.use("/api/books",booksRoutes);
    app.use("/api/events",eventRoutes);
    app.use("/api/donation",donationRoutes);
    app.use("/api/news",newsRoutes);
    app.use("/api/contact",contactRoutes);
    app.use("/api/gallery",galleryRoutes);  
    app.use("/api/newsletter",newsletterRoutes);
    app.use("/api/booklist",book_listingRoutes);
    app.use("/api/collection",donation_collectionRoutes);
    app.use("/api/eventlist",event_lisintingRoutes);
    app.use("/api/socialmedia",social_mediaRoutes);

};
