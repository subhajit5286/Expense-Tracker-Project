const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
exports.addExpense = async (req, res, next)=> {
    const t = await sequelize.transaction();
   try{   

   const amount = req.body.amount;
   const description = req.body.description;
   const category = req.body.category;

   // const data = await Expense.create( {amount: amount, description: description, category: category,userId: req.user.id} )
   // res.status(201).json({newExpense: data});
   // } catch(err){
   //    res.status(500).json({
   //       error: err
   //    })

   // } 
   if(amount == undefined || amount.length === 0) {
      return res.status(400).json({success: false, message: 'Parameters missing'})
  }
   const expense = await Expense.create({ amount, description, category, userId: req.user.id},{transaction: t})
   //.then(expense => {
      console.log("amount",amount);
      console.log("req.user.totalExp",req.user.totalExpenses);
      const totalExpense = Number(req.user.totalExpenses) + Number(amount)
      console.log("totalExpense",totalExpense);
     await User.update({
          totalExpenses: totalExpense
      },{
          where: {id: req.user.id} , transaction: t
      })
    //   .then(async() => {
    //       res.status(200).json({newExpense: expense})
    //   })
    //   .catch(async(err) => {
    //       return res.status(500).json({success: false, error: err})
    //   })
    // }).catch(async(err) => {
    //    return res.status(500).json({success: false, error: err})
    // })
        await t.commit();
        res.status(200).json({newExpense: expense})
    } catch(err) {
        await t.rollback();
        console.log(`posting data is not working`);
        res.status(500).json(err);
    }

}

exports.getExpense = async (req, res, next) => {
    try{
     const expenses = await Expense.findAll({where:{userId:req.user.id}});
     //console.log(expenses);
     return res.status(200).json({allExpenses: expenses,name:req.user.name,isPremium:req.user.ispremiumuser,success:true})
    } catch(error){
     console.log('Get expense is failing', JSON.stringify(error));
     return res.status(500).json({error: err,success:false})
    }
}

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const eId = req.params.id;
    console.log(req.params.id);
    try{
    if(req.params.id == 'undefined'){
       console.log('ID is missing');
      return res.status(400).json({err: 'ID is missing'})
    }
    // await Expense.destroy({where: {id: eId}});
    // res.sendStatus(200);
    // } catch(err){
    //    console.log(err);
    //    res.status(500).json(err)
    // }
    const expense = await Expense.findOne({where: {
        id: eId,
        userId: req.user.id 
       }
      },{transaction:t});
      const totalExpenses = await Expense.sum('amount', {
        where: {userId: req.user.id}
    })
    const updatedTotalExpenses = totalExpenses - expense.amount
    const noOfRows = await Expense.destroy({where: {id: eId, userId: req.user.id}});
    await User.update({
      totalExpenses: updatedTotalExpenses
    },{
      where: {id: req.user.id},
    })
    if(noOfRows === 0) {
      return res.status(404).json({message: `Expense doesn't belongs to user`})
    }
    await t.commit();
    res.sendStatus(200);
      } catch(err){
        await t.rollback();
        console.log(err);
        res.status(500).json(err)
      }
}