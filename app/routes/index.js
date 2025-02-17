const userRoutes = require("../routes/user");
const bannerRoutes=require("../routes/banner")
const biographyRoutes=require("../routes/biography")
const booksRoutes=require("../routes/books")
module.exports = (app) => {
    app.use("/api/user", userRoutes);
    app.use("/api/banner", bannerRoutes);
    app.use("/api/biography",biographyRoutes);
    app.use("/api/books",booksRoutes)
    
};
