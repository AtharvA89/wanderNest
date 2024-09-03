const listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index = async (req, res) => {
  const allListing = await listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const list = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "listing not found!");
    res.redirect("/listings");
  }
  console.log(list);
  res.render("listings/show.ejs", { list });
};

module.exports.createListing = async (req, res, next) => {
  // let response =await geocodingClient.forwardGeocode({
  //   query: req.body.listing.location  ,
  //   limit: 1,
  // })
  //   .send();

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  //newListing.geometry=response.body.features[0],geometry;

  await newListing.save();
  req.flash("success", "new listing added successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id);
  if(!list){
    req.flash("error","listing you requested for doesnot exist")
    res.redirect("/listings");
  }

  let originalImageURL=list.image.url;
  originalImageURL=originalImageURL.replace("/upload","/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue ");
  res.render("listings/edit.ejs", { list,originalImageURL });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let newListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };

    await newListing.save();
  }

  req.flash("success", " listing successfully edited!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  console.log("list deleted");
  req.flash("success", " listing deleted!");
  res.redirect("/listings");
};
