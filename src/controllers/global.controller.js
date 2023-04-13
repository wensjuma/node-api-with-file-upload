




module.exports = (model) =>{

   create = (req, res) => {
        // Validate request
        console.log(req);
        if (!req.body.first_name) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        // Create a Tutorial
        const staff = {
            // staff_id: req.body.staff_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            middle_name: req.body.middle_name,
            email_address: req.body.email_address,
            mobile_number: req.body.mobile_number,
            position: req.body.position,
            // published: req.body.published ? req.body.published : false
        };
        // Save Tutorial in the database
        model.create(staff)
            .then(data => {
                res.send({
                    data: data,
                    resp_message:"Record created successfully",
                    resp_code:'00'
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Tutorial."
                });
            });
    };
    
}