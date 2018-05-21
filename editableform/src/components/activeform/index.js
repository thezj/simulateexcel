export default {
  data() {
    return {
      //合并单元格状态
      mergecelllock: true,
      //拆分单元格状态
      splitcelllock: false,
      //编辑状态
      editcelllock: false,
      //总列数
      columnsum: 24,
      //单列宽度
      columnwidth: 1 / 24 * 100,
      //单列高度
      rowheight: 20,
      //总行数
      rowsum: 12,
      //单元格数据
      cells: [],
      /**
       * 合并单元格相关数据
       */
      //合并单元格鼠标按下，鼠标坐标点
      firstmousedot: null,
      secondmousedot: null,
      //鼠标拖动锁
      draglock: true,
      //鼠标选中区样式
      rendermask: null,
      //选中区域覆盖的单元格
      overlaycell: []
    }
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    mergecelllock(newv, oldc) {
      if (newv) {
        this.splitcelllock = false
        this.editcelllock = false
      }
    },
    splitcelllock(newv, oldc) {
      if (newv) {
        this.mergecelllock = false
        this.editcelllock = false
      }
    },
    editcelllock(newv, oldc) {
      if (newv) {
        this.mergecelllock = false
        this.splitcelllock = false
      }
    }
  },
  mounted() {


    //计算单列宽度 使单元格坐标没有小数
    this.columnwidth = Math.floor($('#celltable').width() / this.columnsum)
    //纠正表格宽度，使其和计算出的单元格宽度总和相等
    $('#celltable').width(this.columnwidth * this.columnsum)
    /**
     * 
     * 初始化表格
     * 单元格对象包含布局数据和单元格内的表单数据
     * 
     */
    Array.from(Array(this.rowsum)).map((row, rowindex) => {
      Array.from(Array(this.columnsum)).map((column, columnindex) => {
        this.cells.push({
          rowindex,
          columnindex,
          colspan: 1,
          rowspan: 1,
          style: {
            width: this.columnwidth * 1 + "px",
            height: this.rowheight * 1 + 'px',
            top: rowindex * this.rowheight + 'px',
            left: columnindex * this.columnwidth + 'px',
            display: 'block',
            backgroundColor: '#fff'
          },
          rectangle: {
            point: [{
              x: columnindex * this.columnwidth,
              y: rowindex * this.rowheight
            }, {
              x: columnindex * this.columnwidth + this.columnwidth * 1,
              y: rowindex * this.rowheight
            }, {
              x: columnindex * this.columnwidth,
              y: rowindex * this.rowheight + this.rowheight * 1
            }, {
              x: columnindex * this.columnwidth + this.columnwidth * 1,
              y: rowindex * this.rowheight + this.rowheight * 1
            }],
            x1: columnindex * this.columnwidth,
            x2: columnindex * this.columnwidth + this.columnwidth * 1,
            y1: rowindex * this.rowheight,
            y2: rowindex * this.rowheight + this.rowheight * 1,
          }
        })
      })
    })


  },

  methods: {

    //增加行
    addline() {
      let rowindex = _.cloneDeep(this.cells).pop().rowindex + 1
      Array.from(Array(this.columnsum)).map((column, columnindex) => {
        this.cells.push({
          rowindex,
          columnindex,
          colspan: 1,
          rowspan: 1,
          style: {
            width: this.columnwidth * 1 + "px",
            height: this.rowheight * 1 + 'px',
            top: rowindex * this.rowheight + 'px',
            left: columnindex * this.columnwidth + 'px',
            display: 'block',
            backgroundColor: '#fff'
          },
          rectangle: {
            point: [{
              x: columnindex * this.columnwidth,
              y: rowindex * this.rowheight
            }, {
              x: columnindex * this.columnwidth + this.columnwidth * 1,
              y: rowindex * this.rowheight
            }, {
              x: columnindex * this.columnwidth,
              y: rowindex * this.rowheight + this.rowheight * 1
            }, {
              x: columnindex * this.columnwidth + this.columnwidth * 1,
              y: rowindex * this.rowheight + this.rowheight * 1
            }],
            x1: columnindex * this.columnwidth,
            x2: columnindex * this.columnwidth + this.columnwidth * 1,
            y1: rowindex * this.rowheight,
            y2: rowindex * this.rowheight + this.rowheight * 1,
          }
        })
      })

      //修正表格边框高度
      $('#celltable').height(this.rowheight * ++rowindex)

    },

    //拆分单元格
    cellclick(cell) {
      if (this.splitcelllock) {

        this.splitcell(cell)
        //刷新单元格的可见状态，如果在合并单元右下角的 都需要隐藏
        this.filtercell()

      }
    },

    //拆分单元格
    splitcell(cell) {
      let rowindex = cell.rowindex
      let columnindex = cell.columnindex
      Object.assign(cell, {
        rowindex,
        columnindex,
        colspan: 1,
        rowspan: 1,
        style: {
          width: this.columnwidth * 1 + "px",
          height: this.rowheight * 1 + 'px',
          top: rowindex * this.rowheight + 'px',
          left: columnindex * this.columnwidth + 'px',
          display: 'block',
          backgroundColor: '#fff'
        },
        rectangle: {
          point: [{
            x: columnindex * this.columnwidth,
            y: rowindex * this.rowheight
          }, {
            x: columnindex * this.columnwidth + this.columnwidth * 1,
            y: rowindex * this.rowheight
          }, {
            x: columnindex * this.columnwidth,
            y: rowindex * this.rowheight + this.rowheight * 1
          }, {
            x: columnindex * this.columnwidth + this.columnwidth * 1,
            y: rowindex * this.rowheight + this.rowheight * 1
          }],
          x1: columnindex * this.columnwidth,
          x2: columnindex * this.columnwidth + this.columnwidth * 1,
          y1: rowindex * this.rowheight,
          y2: rowindex * this.rowheight + this.rowheight * 1,
        }
      })
    },



    //合并单元格鼠标抬起，记录鼠标坐标点
    mergemaskmouseup(e) {
      //拖动锁定
      this.draglock = true

      //取消鼠标选中区域渲染
      this.rendermask = {
        display: 'none'
      }
      //合并选中区域单元格

      if (!this.overlaycell.length) {
        return
      }

      this.overlaycell[0].style.backgroundColor = 'red'

      //选中单元格的矩形数据
      console.log('选中区域全部单元格', this.overlaycell)
      console.log(_.cloneDeep(this.overlaycell).sort((a, b) => a.rectangle.x1 - b.rectangle.x1)[0].rectangle.x1)
      console.log(_.cloneDeep(this.overlaycell).sort((a, b) => a.rectangle.x2 - b.rectangle.x2).pop().rectangle.x2)
      console.log(_.cloneDeep(this.overlaycell).sort((a, b) => a.rectangle.y1 - b.rectangle.y1)[0].rectangle.y1)
      console.log(_.cloneDeep(this.overlaycell).sort((a, b) => a.rectangle.y2 - b.rectangle.y2).pop().rectangle.y2)

      let maxxaxiscell = _.cloneDeep(this.overlaycell).sort((a, b) => a.rectangle.x2 - b.rectangle.x2).pop()
      let maxyaxiscell = _.cloneDeep(this.overlaycell).sort((a, b) => a.rectangle.y2 - b.rectangle.y2).pop()
      let newcolspan = this.overlaycell[0].colspan + (maxxaxiscell.colspan - this.overlaycell[0].colspan) + (maxxaxiscell.columnindex - this.overlaycell[0].columnindex)
      let newrowspan = this.overlaycell[0].rowspan + (maxyaxiscell.rowspan - this.overlaycell[0].rowspan) + (maxyaxiscell.rowindex - this.overlaycell[0].rowindex)

      //如果选区内有其他的合并后的单元格，则先取消其合并状态
      this.overlaycell.map(cell => {
        this.splitcell(cell)
      })

      //给第一个单元格一个合并后的大小尺寸数据
      Object.assign(this.overlaycell[0], {
        colspan: newcolspan,
        rowspan: newrowspan,
      })
      this.overlaycell[0].style.width = this.columnwidth * this.overlaycell[0].colspan + "px"
      this.overlaycell[0].style.height = this.rowheight * this.overlaycell[0].rowspan + 'px'
      this.overlaycell[0].style.backgroundColor = 'yellow'
      this.overlaycell[0].rectangle = {
        point: [{
          x: this.overlaycell[0].columnindex * this.columnwidth,
          y: this.overlaycell[0].rowindex * this.rowheight
        }, {
          x: (this.overlaycell[0].columnindex + this.overlaycell[0].colspan) * this.columnwidth,
          y: this.overlaycell[0].rowindex * this.rowheight
        }, {
          x: this.overlaycell[0].columnindex * this.columnwidth,
          y: (this.overlaycell[0].rowindex + this.overlaycell[0].rowspan) * this.rowheight
        }, {
          x: (this.overlaycell[0].columnindex + this.overlaycell[0].colspan) * this.columnwidth,
          y: (this.overlaycell[0].rowindex + this.overlaycell[0].rowspan) * this.rowheight
        }],
        x1: this.overlaycell[0].columnindex * this.columnwidth,
        x2: (this.overlaycell[0].columnindex + this.overlaycell[0].colspan) * this.columnwidth,
        y1: this.overlaycell[0].rowindex * this.rowheight,
        y2: (this.overlaycell[0].rowindex + this.overlaycell[0].rowspan) * this.rowheight
      }

      //刷新单元格的可见状态，如果在合并单元右下角的 都需要隐藏
      this.filtercell()



    },

    //隐藏被遮挡的单元格
    filtercell() {
      this.cells.map(cell => {
        cell.style.display = 'block'
        cell.style.backgroundColor = '#fff'
      })
      this.cells.map(cell => {
        if (cell.colspan > 1 || cell.rowspan > 1) {
          this.cells.map(subcell => {
            //在cell之后的单元格需要隐藏
            if (subcell.columnindex >= cell.columnindex && subcell.columnindex < cell.columnindex + cell.colspan && subcell.rowindex >= cell.rowindex && subcell.rowindex < cell.rowindex + cell.rowspan) {
              if (!_.isEqual(subcell, cell)) {
                subcell.style.display = 'none'
              }
            }
          })
        }
      })
    },

    //合并单元格鼠标按下，记录鼠标坐标点
    mergemaskmousedown(e) {

      //清空已选区域
      this.overlaycell = []

      //取消拖动锁定
      this.draglock = false
      //取得第一个鼠标点
      this.firstmousedot = {
        x: e.offsetX,
        y: e.offsetY
      }

    },

    //合并单元格鼠标拖动，记录鼠标坐标点
    mergemaskmousemove(e) {
      //判断拖动锁定
      if (!this.draglock) {

        //取得鼠标点
        this.secondmousedot = {
          x: e.offsetX,
          y: e.offsetY
        }

        //使用这2个坐标点获得一个矩形的四个坐标点
        let mouserectangle = this.parsepoint(this.firstmousedot, this.secondmousedot)


        //判定和矩形有重叠的区域
        this.calculateoverlay(mouserectangle)



        //渲染一个鼠标选中区
        this.rendermask = {
          display: 'block',
          left: mouserectangle.x1 + 'px',
          top: mouserectangle.y1 + 'px',
          width: mouserectangle.x2 - mouserectangle.x1 + 'px',
          height: mouserectangle.y2 - mouserectangle.y1 + 'px',
        }

      }


    },

    //计算出和矩形有重叠的单元格
    calculateoverlay(rectangle) {

      let newractangle
      let overlaycelltemp = []

      this.cells.map(cell => {

        //过滤掉隐藏的单元格
        if (cell.style.display == 'none') {
          return
        }

        //判断重合
        if (this.isovelay(cell.rectangle, rectangle)) {
          cell.style.backgroundColor = 'rgba(91, 165, 5, .1)'
          overlaycelltemp.push(cell)
        } else {
          cell.style.backgroundColor = '#fff'
        }
      })

      this.overlaycell = overlaycelltemp
      //计算选中cell所组成的矩形
      let newx1 = rectangle.x1,
        newx2 = rectangle.x2,
        newy1 = rectangle.y1,
        newy2 = rectangle.y2

      overlaycelltemp.map(cell => {
        if (cell.rectangle.x1 < newx1) {
          newx1 = cell.rectangle.x1
        }
        if (cell.rectangle.x2 > newx2) {
          newx2 = cell.rectangle.x2
        }
        if (cell.rectangle.y1 < newy1) {
          newy1 = cell.rectangle.y1
        }
        if (cell.rectangle.y2 > newy2) {
          newy2 = cell.rectangle.y2
        }
      })


      //如果计算出的新矩形 和 传入矩形一致 则完成计算，返回，否则传入新矩形 继续计算
      // this.calculateoverlay(newractangle)

      if (newx1 != rectangle.x1 || newx2 != rectangle.x2 || newy1 != rectangle.y1 || newy2 != rectangle.y2) {
        this.calculateoverlay({
          point: [{
            x: newx1,
            y: newy1
          }, {
            x: newx2,
            y: newy1
          }, {
            x: newx1,
            y: newy2
          }, {
            x: newx2,
            y: newy2
          }],
          x1: newx1,
          x2: newx2,
          y1: newy1,
          y2: newy2,
        })
        console.log('再次计算范围')
      } else {
        return true
      }



    },

    //判断两个矩形重叠
    isovelay(rectangle1, rectangle2) {

      //矩形1有点在矩形2中
      let rectangle1check = false
      rectangle1.point.map(p => {
        if (p.x > rectangle2.x1 && p.x < rectangle2.x2 && p.y > rectangle2.y1 && p.y < rectangle2.y2) {
          rectangle1check = true
        }

        //矩形1和矩形2交叉
        if (rectangle1.x1 >= rectangle2.x1 && rectangle1.x2 <= rectangle2.x2 && rectangle1.y1 <= rectangle2.y1 && rectangle1.y2 >= rectangle2.y2) {
          rectangle1check = true
        }

      })



      //矩形2有点在矩形1中
      let rectangle2check = false
      rectangle2.point.map(p => {
        if (p.x > rectangle1.x1 && p.x < rectangle1.x2 && p.y > rectangle1.y1 && p.y < rectangle1.y2) {
          rectangle2check = true
        }
        //矩形2和矩形1交叉
        if (rectangle2.x1 >= rectangle1.x1 && rectangle2.x2 <= rectangle1.x2 && rectangle2.y1 <= rectangle1.y1 && rectangle2.y2 >= rectangle1.y2) {
          rectangle2check = true
        }
      })





      if (rectangle1check || rectangle2check) {
        return true
      } else {
        return false
      }

    },


    //传入两个坐标点，返回矩形的四个坐标点，和axis数据
    parsepoint(p1, p2) {

      return {
        //四个点
        point: [{
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
          },
          {
            x: Math.max(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
          },
          {
            x: Math.min(p1.x, p2.x),
            y: Math.max(p1.y, p2.y),
          },
          {
            x: Math.max(p1.x, p2.x),
            y: Math.max(p1.y, p2.y),
          }
        ],
        //四个轴线
        x1: Math.min(p1.x, p2.x),
        x2: Math.max(p1.x, p2.x),
        y1: Math.min(p1.y, p2.y),
        y2: Math.max(p1.y, p2.y),
      }


    },




  }
}
