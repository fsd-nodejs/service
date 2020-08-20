declare module 'meeko' {
  interface ArrayFunctions {
    /**
     * 取得交集
     */
    intersect: (arg0: any[], arg1: any[]) => any[]

    /**
     * 取得差集
     */
    except: (arg0: any[], arg1: any[]) => any[]
  }
  // 在此只是简单地进行类型描述
  export const array: ArrayFunctions
}
