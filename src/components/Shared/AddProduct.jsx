import { motion } from 'framer-motion';
import AddProductForm from './Product/AddProductForm';

const AddProduct = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="dark:bg-neutral-950 h-full md:px-[100px] p-5"
    >
      <AddProductForm action="new" />
    </motion.div>
  );
};

export default AddProduct;
