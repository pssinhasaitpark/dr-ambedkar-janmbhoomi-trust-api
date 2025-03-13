const Users = require('./user/user.js')
const Banner=require('./pages/banner.js')
const Biography=require('./pages/about.js')
const Book=require('./pages/books.js')
const Events=require("./pages/events.js")
const Donation=require("./pages/donation.js")
const News=require('./pages/news.js')
const Contact_us=require('./user/contact.js')
const Gallery=require('./pages/gallery.js')
const Testimonials=require('./user/testimonials')
const Newsletter=require('./user/newsletter')
const Booklisting=require('./pages/book_listing')
const Donation_collection=require('./pages/donation_collection')
const Eventlisting=require('./pages/event_lisinting')
const SocialMedia=require('./user/social_media')

module.exports = {
    Users,
    Banner,
    Biography,
    Book,
    Events,
    Donation,
    News,
    Contact_us,
    Gallery,
    Testimonials,
    Newsletter,
    Booklisting,
    Donation_collection,
    Eventlisting,
    SocialMedia
}