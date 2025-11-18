import { request, response } from "express";
import Plan from "../Model/PlanModel.js";
export const createPlan = async (request, response, next) => {
  try {
    const { planName, amount, month, descripation } = request.body;
    const plan = await Plan.create({ planName, amount, month, descripation });
    return response.status(201).json({ msg: "plan created", plan });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal Server Error" });
  }
};
export const planList = async (request, response, next) => {
  try {
    const list = await Plan.find();
    return response.status(200).json({ list: list });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal Server Error" });
  }
};

export const deletePlan = async (request, response, next) => {
  try {
    const { planId } = request.params;
    const deletePlan = await Plan.findByIdAndDelete(planId);
    return response.status(200).json({ msg: "Plan deleted", deletePlan });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

export const updatePlan = async (request, response, next) => {
  try {
    const { planId } = request.params;
    const { planName, amount, month, descripation } = request.body;
    const updateList = await Plan.findByIdAndUpdate(
      planId,
      { planName, amount, month, descripation },
      { new: true }
    );
    if (!updateList)
      return response.status(400).json({ message: "Plan not found" });
    return response
      .status(200)
      .json({ msg: "Plan update successfully", updateList });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
