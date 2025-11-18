import mongoose from "mongoose";
const singlePageSchema = new mongoose.Schema({
    pageType : {
        type : String,
        enum : ["About Us","Terms Conditions","Privacy Policy","Guide Link"],
        required : true,
        unique : true
    },
    content:{
        english : {type : String, default : ""},
        arabic : {type : String, default : ""}
    }
},{timestamps : true});
const Singlepage = mongoose.model("singlepage",singlePageSchema);
export default Singlepage; 