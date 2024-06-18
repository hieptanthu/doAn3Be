const { Category_Model } = require("../models");

async function addChildCategoryToLevel3(ListCateGory = [], data) {
  try {
    let Category
    console.log(ListCateGory)
    if (ListCateGory.length == 0) {
      Category = await Category_Model.create(data)
    }
    else if (ListCateGory.length == 1) {
      Category = await Category_Model.findByIdAndUpdate(ListCateGory[0], { $push: { childCategory: data } })
    }
    else if (ListCateGory.length == 2) {
      Category = await Category_Model.findOneAndUpdate(
        {
          _id: ListCateGory[0],
          "childCategory._id": ListCateGory[1]
        },
        {
          $push: { "childCategory.$.childCategory": data }
        }
      );
    }



    return Category
  } catch (error) {
    console.error('Lỗi khi thêm cấp con vào cấp 3:', error);
  }
}



async function putChildCategoryToLevel3(ListCateGory = [], data) {
  try {
    let Category
    if (ListCateGory.length == 1) {

      Category = await Category_Model.findByIdAndUpdate(ListCateGory[0], { $set: data }, { new: true })
    }
    else if (ListCateGory.length == 2) {
      const categoryId = ListCateGory[0]; // Assuming ListCateGory[0] contains the ID of the document you want to update
      const childCategoryId = ListCateGory[1]; // Assuming ListCateGory[1] contains the ID of the childCategory you want to update
      const dataToUpdate = data
      // Fetch the existing document
      const existingCategory = await Category_Model.findById(categoryId);
      // Get the childCategory to be updated
      const childCategoryToUpdate = existingCategory.childCategory.find(category => category._id.equals(childCategoryId));
      // Merge the existing data with dataToUpdate
      const updatedChildCategory = { ...childCategoryToUpdate.toObject(), ...dataToUpdate };
      // Find the index of the childCategory to update
      const childCategoryIndex = existingCategory.childCategory.findIndex(category => category._id.equals(childCategoryId));

      // Update the childCategory within the array
      existingCategory.childCategory[childCategoryIndex] = updatedChildCategory;

      // Save the updated document
       Category = await existingCategory.save();
    
    }
    if (ListCateGory.length === 3) {
      const categoryId = ListCateGory[0]; 
      const firstLevelChildCategoryId = ListCateGory[1]; // Assuming ListCateGory[1] contains the ID of the first level childCategory you want to update
      const secondLevelChildCategoryId = ListCateGory[2]; // Assuming ListCateGory[2] contains the ID of the second level childCategory you want to update
      const dataToUpdate = data
      // Fetch the existing document
      const existingCategory = await Category_Model.findById(categoryId);
  
      // Get the first level childCategory to be updated
      const firstLevelChildCategoryToUpdate = existingCategory.childCategory.find(category => category._id.equals(firstLevelChildCategoryId));
  
      // Get the second level childCategory to be updated
      const secondLevelChildCategoryToUpdate = firstLevelChildCategoryToUpdate.childCategory.find(category => category._id.equals(secondLevelChildCategoryId));
  
      // Merge the existing data with dataToUpdate for the second level childCategory
      const updatedSecondLevelChildCategory = { ...secondLevelChildCategoryToUpdate.toObject(), ...dataToUpdate };
  
      // Find the index of the second level childCategory to update
      const secondLevelChildCategoryIndex = firstLevelChildCategoryToUpdate.childCategory.findIndex(category => category._id.equals(secondLevelChildCategoryId));
  
      // Update the second level childCategory within the array
      firstLevelChildCategoryToUpdate.childCategory[secondLevelChildCategoryIndex] = updatedSecondLevelChildCategory;
  
      Category = await existingCategory.save();
  
  }
    
    return Category
  } catch (error) {
    console.error('Lỗi khi SỬA cấp con vào cấp 3:', error);
  }
}



async function deleteChildCategoryToLevel3(ListCateGory = []) {
  try {
    
    if (ListCateGory.length == 1) {

      const  Category =await Category_Model.findByIdAndDelete(ListCateGory[0])
      return Category
    }
    else if (ListCateGory.length == 2) {
      const categoryId = ListCateGory[0]; // Assuming ListCateGory[0] contains the ID of the document you want to update
      const childCategoryId = ListCateGory[1]; // Assuming ListCateGory[1] contains the ID of the childCategory you want to update
      // Fetch the existing document
      const existingCategory = await Category_Model.findById(categoryId);

      const childCategoryIndex = existingCategory.childCategory.findIndex(category => category._id.equals(childCategoryId));

      // Update the childCategory within the array
      if (childCategoryIndex !== -1) {
        existingCategory.childCategory.splice(childCategoryIndex, 1);
    }

    const  Category = await existingCategory.save();
    return Category
    
    }
    else if(ListCateGory.length === 3) {
      const categoryId = ListCateGory[0]; 
      const firstLevelChildCategoryId = ListCateGory[1]; // Assuming ListCateGory[1] contains the ID of the first level childCategory you want to update
      const secondLevelChildCategoryId = ListCateGory[2]; // Assuming ListCateGory[2] contains the ID of the second level childCategory you want to update
      // Fetch the existing document
      const existingCategory = await Category_Model.findById(categoryId);
  
      // Get the first level childCategory to be updated
      const firstLevelChildCategoryToUpdate = existingCategory.childCategory.find(category => category._id.equals(firstLevelChildCategoryId));

     
  
      const secondLevelChildCategoryIndex = firstLevelChildCategoryToUpdate.childCategory.findIndex(category => category._id.equals(secondLevelChildCategoryId));

      // Delete the second level childCategory from the array
      if (secondLevelChildCategoryIndex !== -1) {
          firstLevelChildCategoryToUpdate.childCategory.splice(secondLevelChildCategoryIndex, 1);
      }
      
      console.log(firstLevelChildCategoryToUpdate);
  
      const  Category = await existingCategory.save();
      return Category
  
  }
   
  } catch (error) {
    console.error('Lỗi khi SỬA cấp con vào cấp 3:', error);
  }
}

module.exports = { addChildCategoryToLevel3, putChildCategoryToLevel3 ,deleteChildCategoryToLevel3}