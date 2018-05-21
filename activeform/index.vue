<template>
  <div class="activeform">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbutton" @click='mergecelllock = true'>
        <i class="fa fa-square"></i>
        <div>合并单元格</div>
        <el-switch v-model="mergecelllock" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </div>
      <div class="toolbutton" @click='splitcelllock = true'>
        <i class="fa fa-th-large"></i>
        <div>取消合并</div>
        <el-switch v-model="splitcelllock" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </div>
      <div class="toolbutton" @click='editcelllock = true'>
        <i class="fa fa-pencil-square-o"></i>
        <div>编辑</div>
        <el-switch v-model="editcelllock" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table" id="celltable" :style='{height:rowsum*rowheight+"px"}'>
      <div class="mergecellmask" v-if='mergecelllock' @mousedown='mergemaskmousedown($event)' @mousemove='mergemaskmousemove($event)'
        @mouseup='mergemaskmouseup($event)'></div>
      <div class="rendermask" v-if='mergecelllock' :style='rendermask'></div>
      <div @click='cellclick(cell)' v-for='cell in cells' class="cell" :style='cell.style'>
        <!-- {{cell.colspan}}
        {{cell.rowspan}}
        {{cell.rectangle.x2}}
        {{cell.rectangle.y2}} -->
      </div>
    </div>

  </div>
</template>
<script>
  export default require('./index.js')
</script>
<style lang="less" scoped>
  @import './index.less';
</style>