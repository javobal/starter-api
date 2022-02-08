import { Enforcer, newEnforcer } from 'casbin';

let e: Enforcer

export async function init() {
    e = await newEnforcer('./src/lib/casbin/model.conf', './src/lib/casbin/policy.csv', true);
}

export function getEnforcer() {
    return e
}
