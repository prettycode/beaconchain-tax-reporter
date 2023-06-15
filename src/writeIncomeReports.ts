import { CoinTrackingRecord, executionIncomeToCoinTrackingRecord, withdrawalIncomeToCoinTrackingRecord } from './services/cointracking';
import { ValidatorIncome } from './services/income';
import { convertToCsv } from './utils/convertToCsv';
import fs from 'fs';

export async function writeIncomeReports(
    filePath: string, 
    withdrawals: Array<ValidatorIncome>, 
    executions: Array<ValidatorIncome>, 
    withdrawalsAndExecutions: Array<ValidatorIncome>
) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { 
            recursive: true, 
            force: true
        });
    }
    
    fs.mkdirSync(filePath);

    await Promise.all([
        writeIncomeReportValidatorWithdrawals(filePath, withdrawals),
        writeIncomeReportValidatorExecution(filePath, executions),
        writeIncomeReportValidatorWithdrawalsAndExecutions(filePath, withdrawalsAndExecutions),
        writeIncomeReportCombinedValidatorTaxes(filePath, withdrawals, executions)
    ]);
}

export async function writeIncomeReportValidatorWithdrawals(filePath: string, withdrawals: Array<ValidatorIncome>): Promise<void> {
    const validatorIndices: Array<number> = [...new Set(withdrawals.map(validatior => validatior.validatorIndex))];

    for(const validatorIndex of validatorIndices) {
        const filename = `${filePath}/${validatorIndex}.withdrawals.csv`;
        const fileContents = convertToCsv(withdrawals.filter(income => income.validatorIndex === validatorIndex));
        
        await fs.promises.writeFile(filename, fileContents, 'utf-8');
    }
    
    await fs.promises.writeFile(`${filePath}/${validatorIndices.join(',')}.withdrawals.csv`, convertToCsv(withdrawals), 'utf-8');
}

export async function writeIncomeReportValidatorExecution(filePath: string, executions: Array<ValidatorIncome>): Promise<void> {
    const validatorIndices: Array<number> = [...new Set(executions.map(execution => execution.validatorIndex))];

    for(const validatorIndex of validatorIndices) {
        const filename = `${filePath}/${validatorIndex}.execution.csv`;
        const fileContents = convertToCsv(executions.filter(income => income.validatorIndex === validatorIndex));
        
        await fs.promises.writeFile(filename, fileContents, 'utf-8');
    }
    
    await fs.promises.writeFile(`${filePath}/${validatorIndices.join(',')}.execution.csv`, convertToCsv(executions), 'utf-8');
}

export async function writeIncomeReportValidatorWithdrawalsAndExecutions(filePath: string, withdrawalsAndExecutions: Array<ValidatorIncome>): Promise<void> {
    const validatorIndices: Array<number> = [...new Set(withdrawalsAndExecutions.map(execution => execution.validatorIndex))];

    for(const validatorIndex of validatorIndices) {
        const filename = `${filePath}/${validatorIndex}.csv`;
        const fileContents = convertToCsv(withdrawalsAndExecutions.filter(income => income.validatorIndex === validatorIndex));
        
        await fs.promises.writeFile(filename, fileContents, 'utf-8');
    }
    
    await fs.promises.writeFile(`${filePath}/${validatorIndices.join(',')}.csv`, convertToCsv(withdrawalsAndExecutions), 'utf-8');
}

export async function writeIncomeReportCombinedValidatorTaxes(filePath: string, withdrawals: Array<ValidatorIncome>, executions: Array<ValidatorIncome>): Promise<void> {
    const taxHistory: Array<CoinTrackingRecord> = [
        ...withdrawals.map(withdrawalIncomeToCoinTrackingRecord),
        ...executions.map(executionIncomeToCoinTrackingRecord)
    ].sort((a: CoinTrackingRecord, b: CoinTrackingRecord) => new Date(b.date).getTime() - new Date(a.date).getTime());

    await fs.promises.writeFile(`${filePath}/cointracking.info bulk import.csv`, convertToCsv(taxHistory), 'utf-8');    
}
