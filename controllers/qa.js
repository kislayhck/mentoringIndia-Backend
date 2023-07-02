const QA = require('../models/qa');

const viewQuestion = async (req, res) => {
  try {
    const question = await QA.find({});
    // console.log('question');
    return res.status(200).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "An Error Occured!"});
  }
}

const createQuestion = async (req, res) => {
  try {
    const question = new QA(req.body);
    await question.save();
    return  res.status(201).json({ msg: "Question Created!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error!\nTry Again Later" });
  }
}

const editQuestion = async (req, res) => {
  try {
    let question = await QA.findById({ _id: req.params._id });
    question = req.body;
    await question.save();
    return res.status(201).json({ msg: "Question Updated!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error!\nTry Again Later" });
  }
}

const deleteQuestion = async (req, res) => {
  try {
    const question = await QA.deleteOne({ _id: req.params._id });
    if (!question) return res.status(404).json({ msg: 'Question Already Deleted!' });
    return res.status(200).json({msg: "Question Deleted!"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error!\nTry Again Later" });
  }
}

const userQuestion = async (req, res) => {
  try {
    const question = await QA.find({});
    // console.log('question');
    return res.status(200).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "An Error Occured!"});
  }
}

module.exports = {
  viewQuestion,
  createQuestion,
  editQuestion,
  deleteQuestion,
  userQuestion
};