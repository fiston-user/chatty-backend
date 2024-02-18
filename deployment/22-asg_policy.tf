resource "aws_autoscaling_policy" "asg_scale_out_policy" {
  name                   = "ASG-SCLAE-OUT-POLICY"
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling_group.name
  adjustment_type        = "ChangeInCapacity"
  policy_type            = "SimpleScaling"
  scaling_adjustment     = 1
  cooldown               = 150
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}

resource "aws_cloudwatch_metric_alarm" "ec2_scale_out_alarm" {
  alarm_name          = "EC2_SCALE_OUT_ALARM"
  alarm_description   = "This metric monitors the CPU utilization of the EC2 instances"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = 50
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling_group.name
  }
  alarm_actions = [aws_autoscaling_policy.asg_scale_out_policy.arn]
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}


resource "aws_autoscaling_policy" "asg_scale_in_policy" {
  name                   = "ASG-SCLAE-IN-POLICY"
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling_group.name
  adjustment_type        = "ChangeInCapacity"
  policy_type            = "SimpleScaling"
  scaling_adjustment     = -1
  cooldown               = 150
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}

resource "aws_cloudwatch_metric_alarm" "ec2_scale_in_alarm" {
  alarm_name          = "EC2_SCALE_IN_ALARM"
  alarm_description   = "This metric monitors the CPU utilization of the EC2 instances"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = 10
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling_group.name
  }
  alarm_actions = [aws_autoscaling_policy.asg_scale_in_policy.arn]
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}
