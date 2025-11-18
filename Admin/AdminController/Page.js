import { request, response } from "express";
import Singlepage from "../Model/PageModel.js";

export const getSinglePage = async (request, response, next) => {
  try {
    const { pageType } = request.params;
    let page = await Singlepage.findOne({ pageType });
    if (!page) return response.status(400).json({ msg: "Page not found" });
    return response.status(200).json({ pageList: page });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal Server Error" });
  }
};

export const updatePage = async (request, response, next) => {
  try {
    const { pageType } = request.params;
    const { lang, content } = request.body;
    let page = await Singlepage.findOne({ pageType });
    if (!page) page = await Singlepage.create({ pageType });
    page.content[lang] = content;
    await page.save();
    return response.status(200).json({ msg: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
