exports.requestJoinCompany = async (req, res, next) => {
  try {
    const { companyId } = req.body;
    const userId = req.user.id;

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Prevent duplicate requests
    if (company.recruiters.includes(userId) || company.pendingRecruiters.includes(userId)) {
      return res.status(409).json({ message: "Already joined or pending approval" });
    }

    company.pendingRecruiters.push(userId);
    await company.save();

    res.status(200).json({ message: "Join request sent to company" });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error requesting to join company";
    next(err);
  }
};


