export const roleBaseControl = async (req, res, next) => {
  try {
    const currentRole = req.users?.role;

    if (!currentRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User role not found.",
      });
    }

    if (currentRole !== "seller" && currentRole !== "admin"  ) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Only sellers/admin are allowed to perform this action. while you are ${currentRole}`,
      });
    }

   
    console.log("Role verified: seller");
    next();

  } catch (error) {
    next(error);
  }
};




//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................