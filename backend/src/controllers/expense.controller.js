const Expense = require('../models/expense.model');

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Expense.destroy({
            where: {
                id: id,
                created_by: req.user.id
            }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการลบ หรือคุณไม่มีสิทธิ์' });
        }

        return res.json({ message: 'ลบรายการค่าใช้จ่ายสำเร็จ' });
    } catch (error) {
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์', error: error.message });
    }
};