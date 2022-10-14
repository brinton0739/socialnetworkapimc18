const { Thought } = require("../../model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const thoughts = await Thought.find();
  if (!thoughts) {
    res.status(200).json("[]");
  }
  res.status(200).json(thoughts);
});

router.get("/:thought_id", async (req, res) => {
  const thought = await Thought.findOne({_id: req.params.thought_id});
  if (!thought) {
    res.status(404).end();
  }
  res.status(200).json(thought);
});

router.post("/", (req, res) => {
  Thought.create(req.body, (err, doc) => {
    if (err) {
      res.status(500).json(`thought not created err: ${err}`);
    } else {
        res.status(200).json(doc);
    }
  });
});

router.put("/:thought_id", (req, res) => {
  const thought = Thought.findByIdAndUpdate(
    req.params.thought_id,
    req.body,
    { new: true },
    async (err, doc) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(doc);
      }
    }
  );
});

router.delete("/:thought_id", (req, res) => {
  Thought.findByIdAndDelete(req.params.thought_id, (err, doc) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(204).end();
    }
  });
});

router.post("/:thought_id/reactions", (req, res) => {
  Thought.findById(req.params.thought_id, (err, doc) => {
    if (err) {
      res.status(500).json(err);
    } else if (!doc.id) {
      res.status(404).end();
    } else {
      doc.reactions.push(req.body);
      Thought.findByIdAndUpdate(
        req.params.thought_id,
        doc,
        { new: true },
        (err, doc) => {
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json(doc);
          }
        }
      );
    }
  });
});

router.delete("/:thought_id/reactions/:reaction_id", (req, res) => {
  Thought.findById(req.params.thought_id, (err, doc) => {
    if (err) {
      res.status(500).json(err);
    } else if (!doc.id) {
      res.status(404).end();
    } else {
      doc.reactions = doc.reactions.filter((reaction) => {
        return reaction._id.toString() !== req.params.reaction_id;
      });
      Thought.findByIdAndDelete(
        req.params.thought_id,
        doc,
        { new: true },
        (err, doc) => {
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json(doc);
          }
        }
      );
    }
  });
});

module.exports = router;
