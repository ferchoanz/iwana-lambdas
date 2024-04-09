interface IOngPayment {
    id: number;
    code: string;
    ongPaymentState: { name: string };
    ong: { name: string };
    ongPaymentUserConfig: { amount: string }[];
    created_at: Date;
    update_at: Date;
    [attr: string]: any;
}

export const SumAmountHelper = async (data: IOngPayment[]) => {
    return data.map((item) => {
        item.amount = 0;

        item.ongPaymentUserConfig.forEach((opuc) => {
            item.amount += parseFloat(opuc.amount);
        });

        delete item.ongPaymentUserConfig;
        return item;
    });
};
